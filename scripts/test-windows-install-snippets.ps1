# Verifies every PowerShell install snippet under versioned_docs/version-4.0.0/
# that downloads from keploy.io/ent/dl:
#   1. All copies are byte-identical after removing Markdown list indentation.
#   2. Runs the snippet under both Windows PowerShell 5.1 (powershell.exe) and
#      PowerShell 7+ (pwsh) against a local HTTP/1.1 server covering fresh
#      install, valid update, HTTP 404, truncated .gz, mid-body connection cut,
#      corrupt .gz, .gz checksum mismatch, raw .exe checksum mismatch,
#      release.txt 503, checksums.txt 503, and a locked running keploy.exe.
#   3. Verifies every failure exits non-zero, preserves existing keploy.exe
#      byte-for-byte, leaves zero .gz/.new temp files, and does not leak
#      $ErrorActionPreference into the caller's shell.
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$PwshPath = ''
)

$ErrorActionPreference = 'Stop'

# 1. Extract all PowerShell install snippets under versioned_docs/version-4.0.0
$docsRoot = Join-Path $RepoRoot 'versioned_docs\version-4.0.0'
$snippets = @()
Get-ChildItem -Path $docsRoot -Recurse -Filter '*.md' | Sort-Object FullName | ForEach-Object {
  $file = $_.FullName
  $lines = Get-Content -Path $file
  $inBlock = $false
  $indent = ''
  $buf = New-Object System.Collections.Generic.List[string]
  foreach ($ln in $lines) {
    if (-not $inBlock) {
      if ($ln -match '^(\s*)```powershell\s*$') {
        $inBlock = $true
        $indent = $Matches[1]
        $buf.Clear()
      }
    } else {
      if ($ln -match '^\s*```\s*$') {
        $inBlock = $false
        $raw = ($buf | ForEach-Object {
          if ($indent.Length -gt 0 -and $_.StartsWith($indent)) { $_.Substring($indent.Length) } else { $_ }
        }) -join "`n"
        if ($raw -like '*keploy.io/ent/dl/*') {
          $snippets += [PSCustomObject]@{ File = $file; Body = $raw }
        }
      } else {
        $buf.Add($ln)
      }
    }
  }
}

if ($snippets.Count -ne 4) {
  throw "Expected 4 Windows PowerShell install snippets under versioned_docs/version-4.0.0, found $($snippets.Count): $($snippets.File -join ', ')"
}
$canonical = $snippets[0].Body
for ($i = 1; $i -lt $snippets.Count; $i++) {
  if ($snippets[$i].Body -cne $canonical) {
    throw "Windows PowerShell snippet in $($snippets[$i].File) differs from $($snippets[0].File)"
  }
}
Write-Host "OK: $($snippets.Count) Windows PowerShell snippets extracted and verified byte-identical."

# Verify the snippet relies strictly on built-in .NET APIs (no external decompression/hash tools).
if ($canonical -notmatch 'IO\.Compression\.GZipStream' -or $canonical -notmatch 'Get-FileHash') {
  throw "Windows snippet must use built-in IO.Compression.GZipStream and Get-FileHash"
}
foreach ($forbidden in @('\bgzip\b', '\bgunzip\b', '\btar\.exe\b', '\b7z\b', '\bcurl(\.exe)?\b', '\bcertutil\b')) {
  if ($canonical -match $forbidden) {
    throw "Windows snippet must not depend on external tool matching /$forbidden/"
  }
}
Write-Host "OK: Windows PowerShell snippet verified to use only built-in .NET APIs (no external tools)."

# 2. Build test workspace & fixtures (using real small Windows system EXEs)
$work = Join-Path ([IO.Path]::GetTempPath()) ("keploy-win-snippet-test-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
$serve = Join-Path $work 'serve'
New-Item -ItemType Directory -Force $serve | Out-Null

function Write-Gzip([string]$src, [string]$dst) {
  $in = [IO.File]::OpenRead($src)
  $out = [IO.File]::Create($dst)
  $gz = New-Object IO.Compression.GZipStream($out, [IO.Compression.CompressionLevel]::Optimal)
  try { $in.CopyTo($gz) } finally { $gz.Dispose(); $out.Dispose(); $in.Dispose() }
}

$oldExe = "$env:WINDIR\System32\whoami.exe"
$newExe = "$env:WINDIR\System32\hostname.exe"
$oldHash = (Get-FileHash -Path $oldExe -Algorithm SHA256).Hash
$newHash = (Get-FileHash -Path $newExe -Algorithm SHA256).Hash
$ver = '3.9.99'

$goodGz = Join-Path $work 'new.exe.gz'
Write-Gzip $newExe $goodGz
$goodGzHash = (Get-FileHash -Path $goodGz -Algorithm SHA256).Hash
$goodGzBytes = [IO.File]::ReadAllBytes($goodGz)

function Make-CaseDir([string]$name) {
  $d = Join-Path $serve $name
  New-Item -ItemType Directory -Force (Join-Path $d 'latest') | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $d $ver) | Out-Null
  [IO.File]::WriteAllText((Join-Path $d 'latest\release.txt'), "refs/tags/v$ver`n")
  $sums = "$newHash  enterprise_windows_amd64.exe`n$goodGzHash  enterprise_windows_amd64.exe.gz`n"
  [IO.File]::WriteAllText((Join-Path $d "$ver\enterprise_${ver}_checksums.txt"), $sums)
  Copy-Item $goodGz (Join-Path $d "$ver\enterprise_windows_amd64.exe.gz")
  return $d
}

Make-CaseDir 'good' | Out-Null

$d404 = Make-CaseDir 'c404'
Remove-Item (Join-Path $d404 "$ver\enterprise_windows_amd64.exe.gz")

$dTrunc = Make-CaseDir 'trunc'
$half = New-Object byte[] ([int]($goodGzBytes.Length / 2))
[Array]::Copy($goodGzBytes, $half, $half.Length)
[IO.File]::WriteAllBytes((Join-Path $dTrunc "$ver\enterprise_windows_amd64.exe.gz"), $half)

$dCut = Make-CaseDir 'cut'
[IO.File]::WriteAllText((Join-Path $dCut "$ver\enterprise_windows_amd64.exe.gz.cut"), '1')

$dCorrupt = Make-CaseDir 'corrupt'
[IO.File]::WriteAllText((Join-Path $dCorrupt "$ver\enterprise_windows_amd64.exe.gz"), 'not a valid gzip stream')

$dBadGz = Make-CaseDir 'bad-gz-sha'
$badSumsGz = "$newHash  enterprise_windows_amd64.exe`n0000000000000000000000000000000000000000000000000000000000000000  enterprise_windows_amd64.exe.gz`n"
[IO.File]::WriteAllText((Join-Path $dBadGz "$ver\enterprise_${ver}_checksums.txt"), $badSumsGz)

$dBadRaw = Make-CaseDir 'bad-raw-sha'
$badSumsRaw = "0000000000000000000000000000000000000000000000000000000000000000  enterprise_windows_amd64.exe`n$goodGzHash  enterprise_windows_amd64.exe.gz`n"
[IO.File]::WriteAllText((Join-Path $dBadRaw "$ver\enterprise_${ver}_checksums.txt"), $badSumsRaw)

$dRel503 = Make-CaseDir 'rel503'
[IO.File]::WriteAllText((Join-Path $dRel503 'latest\release.txt.503'), '1')

$dSums503 = Make-CaseDir 'sums503'
[IO.File]::WriteAllText((Join-Path $dSums503 "$ver\enterprise_${ver}_checksums.txt.503"), '1')

# 3. Start local HTTP/1.1 TCP server on an ephemeral loopback port
$tmpL = New-Object Net.Sockets.TcpListener([Net.IPAddress]::Loopback, 0)
$tmpL.Start()
$port = $tmpL.LocalEndpoint.Port
$tmpL.Stop()

$serverScript = Join-Path $work 'server.ps1'
@'
param([int]$Port, [string]$Base)
$l = New-Object Net.Sockets.TcpListener([Net.IPAddress]::Loopback, $Port)
$l.Start()
while ($true) {
  $c = $l.AcceptTcpClient()
  try {
    $s = $c.GetStream()
    $r = New-Object IO.StreamReader($s, [Text.Encoding]::ASCII, $false, 4096, $true)
    $line = $r.ReadLine()
    while ($true) { $h = $r.ReadLine(); if ($null -eq $h -or $h -eq '') { break } }
    $path = ($line -split ' ')[1]
    $rootName = ([IO.File]::ReadAllText((Join-Path $Base 'active.txt'))).Trim()
    $f = Join-Path (Join-Path $Base $rootName) ($path.TrimStart('/').Replace('/', '\'))
    if ([IO.File]::Exists("$f.503")) {
      $body = [Text.Encoding]::ASCII.GetBytes('Service Unavailable')
      $hdr = "HTTP/1.1 503 Service Unavailable`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $b = [Text.Encoding]::ASCII.GetBytes($hdr); $s.Write($b, 0, $b.Length); $s.Write($body, 0, $body.Length)
    } elseif ((-not $path.Contains('..')) -and [IO.File]::Exists($f)) {
      $len = (New-Object IO.FileInfo($f)).Length
      $cut = [IO.File]::Exists("$f.cut")
      $ct = if ($f.EndsWith('.txt')) { 'text/plain; charset=utf-8' } else { 'application/x-gzip' }
      $hdr = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $len`r`nConnection: close`r`n`r`n"
      $b = [Text.Encoding]::ASCII.GetBytes($hdr); $s.Write($b, 0, $b.Length)
      $fs = [IO.File]::OpenRead($f)
      $limit = if ($cut) { [int64]($len / 2) } else { $len }
      $buf = New-Object byte[] 65536; $sent = [int64]0
      while ($sent -lt $limit) {
        $want = [int][Math]::Min([int64]$buf.Length, $limit - $sent)
        $n = $fs.Read($buf, 0, $want); if ($n -le 0) { break }
        $s.Write($buf, 0, $n); $sent += $n
      }
      $fs.Dispose()
    } else {
      $body = [Text.Encoding]::ASCII.GetBytes('Not Found')
      $hdr = "HTTP/1.1 404 Not Found`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $b = [Text.Encoding]::ASCII.GetBytes($hdr); $s.Write($b, 0, $b.Length); $s.Write($body, 0, $body.Length)
    }
    $s.Flush()
  } catch { } finally { $c.Close() }
}
'@ | Set-Content -Path $serverScript -Encoding UTF8

$localSnippet = $canonical.Replace('https://keploy.io/ent/dl', "http://127.0.0.1:$port")
$snippetFile = Join-Path $work 'snippet.ps1'
# Append a sentinel checking that $ErrorActionPreference stayed 'Continue' in caller scope.
$wrappedSnippet = "`$ErrorActionPreference = 'Continue'`n" + $localSnippet + "`nif (`$ErrorActionPreference -ne 'Continue') { throw 'ErrorActionPreference leaked into caller shell' }`n"
[IO.File]::WriteAllText($snippetFile, $wrappedSnippet)

$engines = [ordered]@{ 'ps51' = "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" }
if ($PwshPath -and (Test-Path $PwshPath)) {
  $engines['pwsh'] = $PwshPath
} else {
  $pwshCmd = Get-Command pwsh -ErrorAction SilentlyContinue
  if ($pwshCmd) { $engines['pwsh'] = $pwshCmd.Source }
}

$savedUserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$savedLAD = $env:LOCALAPPDATA
$srv = Start-Process -FilePath $engines['ps51'] -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $serverScript, '-Port', "$port", '-Base', $serve -PassThru -WindowStyle Hidden
Start-Sleep 2

$passed = 0
$failed = 0
try {
  $cases = @(
    @{ Name = 'fresh-install'; Root = 'good'; Seed = 'none'; WantRC = 0; WantHash = $newHash; WantOut = '' },
    @{ Name = 'update-good'; Root = 'good'; Seed = 'old'; WantRC = 0; WantHash = $newHash; WantOut = '' },
    @{ Name = '404'; Root = 'c404'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Keploy was not updated:' },
    @{ Name = 'truncated-gz'; Root = 'trunc'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Checksum mismatch for keploy.exe.gz' },
    @{ Name = 'cut-mid-body'; Root = 'cut'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Keploy was not updated:' },
    @{ Name = 'corrupt-gz'; Root = 'corrupt'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Checksum mismatch for keploy.exe.gz' },
    @{ Name = 'bad-gz-sha'; Root = 'bad-gz-sha'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Checksum mismatch for keploy.exe.gz' },
    @{ Name = 'bad-raw-sha'; Root = 'bad-raw-sha'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Checksum mismatch for keploy.exe' },
    @{ Name = 'release-txt-503'; Root = 'rel503'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = '' },
    @{ Name = 'checksums-503'; Root = 'sums503'; Seed = 'old'; WantRC = 1; WantHash = $oldHash; WantOut = 'Keploy was not updated:' },
    @{ Name = 'running-keploy-exe'; Root = 'good'; Seed = 'running'; WantRC = 1; WantHash = ''; WantOut = 'If keploy is running, close it' }
  )

  foreach ($eng in $engines.Keys) {
    Write-Host "=== Engine: $eng ($($engines[$eng])) ==="
    foreach ($tc in $cases) {
      $lad = Join-Path $work "run-$eng-$($tc.Name)"
      $dir = Join-Path $lad '.keploy\bin'
      New-Item -ItemType Directory -Force $dir | Out-Null
      $proc = $null
      $wantHash = $tc.WantHash
      if ($tc.Seed -eq 'old') {
        Copy-Item $oldExe (Join-Path $dir 'keploy.exe')
      } elseif ($tc.Seed -eq 'running') {
        $pingExe = "$env:WINDIR\System32\PING.EXE"
        Copy-Item $pingExe (Join-Path $dir 'keploy.exe')
        $wantHash = (Get-FileHash -Path $pingExe -Algorithm SHA256).Hash
        $proc = Start-Process -FilePath (Join-Path $dir 'keploy.exe') -ArgumentList '-n', '300', '127.0.0.1' -PassThru -WindowStyle Hidden
        Start-Sleep 1
      }
      [IO.File]::WriteAllText((Join-Path $serve 'active.txt'), $tc.Root)
      $env:LOCALAPPDATA = $lad
      $out = & $engines[$eng] -NoProfile -ExecutionPolicy Bypass -File $snippetFile 2>&1 | Out-String
      $rc = $LASTEXITCODE
      $env:LOCALAPPDATA = $savedLAD

      $afterHash = if (Test-Path (Join-Path $dir 'keploy.exe')) { (Get-FileHash -Path (Join-Path $dir 'keploy.exe') -Algorithm SHA256).Hash } else { 'ABSENT' }
      $files = ((Get-ChildItem -Force $dir | ForEach-Object { $_.Name }) -join ',')
      if ($proc) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue; Start-Sleep 1 }

      $ok = $true
      $reasons = @()
      if ($tc.WantRC -eq 0 -and $rc -ne 0) { $ok = $false; $reasons += "rc=$rc want 0" }
      if ($tc.WantRC -ne 0 -and $rc -eq 0) { $ok = $false; $reasons += "rc=0 want non-zero" }
      if ($afterHash -ne $wantHash) { $ok = $false; $reasons += "hash=$afterHash want $wantHash" }
      if ($files -ne 'keploy.exe') { $ok = $false; $reasons += "files=[$files] want [keploy.exe]" }
      if ($tc.WantOut -and ($out -notlike "*$($tc.WantOut)*")) { $ok = $false; $reasons += "output missing '$($tc.WantOut)'" }

      if ($ok) {
        $passed++
        Write-Host "  PASS [$eng] $($tc.Name) rc=$rc files=[$files]"
      } else {
        $failed++
        Write-Host "  FAIL [$eng] $($tc.Name): $($reasons -join '; ')"
        Write-Host "       output: $($out.Trim())"
      }
    }
  }
} finally {
  Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue
  [Environment]::SetEnvironmentVariable('Path', $savedUserPath, 'User')
  $env:LOCALAPPDATA = $savedLAD
  Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}

Write-Host "WINDOWS_SNIPPETS_SUMMARY passed=$passed failed=$failed engines=$($engines.Keys -join ',')"
if ($failed -ne 0 -or $passed -eq 0) {
  exit 1
}
Write-Host "WINDOWS_SNIPPETS_TEST_ALL_OK=1"
