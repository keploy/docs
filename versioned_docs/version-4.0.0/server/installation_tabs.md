---
id: installation
title: Installing Keploy
sidebar_label: Installation
description: Installation guide for Keploy on Linux, macOS, and Windows.
hide_table_of_contents: true
tags:
  - installation
keywords:
  - linux
  - macos
  - windows
  - ebpf
  - limas
  - wsl
  - installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Keploy

This guide walks you through installing the Keploy CLI, which enables you to record API calls and replay them as sandboxes for testing.

## 1. Install Keploy CLI

Run this command to install Keploy:

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

Once done, you should see something like this:

```bash
🐰 Keploy: INFO Starting Keploy {"version": "3.3.8", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.3.8


Golang Application
	Record:
	keploy record -c "/path/to/user/app/binary"

	Test:
	keploy test -c "/path/to/user/app/binary" --delay 10

Node Application
	Record:
	keploy record -c "npm start --prefix /path/to/node/app"

	Test:
	keploy test -c "npm start --prefix /path/to/node/app" --delay 10

Java
	Record:
	keploy record -c "java -jar /path/to/java-project/target/jar"

	Test:
	keploy test -c "java -jar /path/to/java-project/target/jar" --delay 10

Docker
	Record:
	keploy record -c "docker run -p 8080:8080 --name <containerName> --network <networkName> <applicationImage>" --buildDelay 60

	Test:
	keploy test -c "docker run -p 8080:8080 --name <containerName> --network <networkName> <applicationImage>" --delay 1 --buildDelay 60


Note: If installed without One Click Install, use "keploy example --customSetup true"


Please log in to your Keploy account to access the paid features.
You can log in by running the 'keploy login' command.
```

## 2. Log in to Keploy

After installing, authenticate with your Keploy account. 
Choose the method that fits your setup:

<Tabs>
<TabItem value="browser" label="Browser Login (Default)">

Keploy opens a browser window to sign you in automatically:

```bash
keploy login
```

```bash
Opening browser for authentication...

If the browser does not open automatically, please visit:
https://app.keploy.io/signin/integration/auth?method=code&code=<YOUR_CODE>

Waiting for authentication...
Logged in successfully!
```

</TabItem>
<TabItem value="manual" label="Manual Login">

If a browser cannot open (for example in a remote terminal):

```bash
keploy login --manual-login
```

When prompted, enter your Keploy API key. To get your API key:

1. Log in to [app.keploy.io](https://app.keploy.io)
2. Click on your **user profile** at the bottom left
3. Go to **Account Settings**
4. In the sidebar, select **API Keys**
5. Click **Generate new token**
6. Fill in the details:
   - **Token name** — give it a recognizable name
   - **Scopes** — select the access level you need:
     - **Read** — read-only access to resources
     - **Write** — read and write access
     - **Admin** — full administrative access
   - **Expiration** — default is 90 days
7. Click **Generate token**
8. **Copy the token immediately** — it will not be shown again

Once your API key is verified, you will see:

```bash
API key verified successfully!
You are on the Keploy Community plan.
```

</TabItem>
<TabItem value="apikey" label="API Key (CI/CD)">

For CI/CD environments, authenticate using an API key:

```bash
keploy login --api-key <YOUR_API_KEY>
```

You can also set it as an environment variable:

```bash
export KEPLOY_API_KEY=<YOUR_API_KEY>
```

### How to get your API key

1. Log in to [app.keploy.io](https://app.keploy.io)
2. Click on your **user profile** at the bottom left
3. Go to **Account Settings**
4. In the sidebar, select **API Keys**
5. Click **Generate new token**
6. Fill in the details:
   - **Token name** — give it a recognizable name
   - **Scopes** — select the access level you need:
     - **Read** — read-only access to resources
     - **Write** — read and write access
     - **Admin** — full administrative access
   - **Expiration** — default is 90 days
7. Click **Generate token**
8. **Copy the token immediately** — it will not be shown again

Once your API key is verified, you will see:

```bash
API key verified successfully!
You are on the Keploy Community plan.
```

</TabItem>
</Tabs>

Now you can start using Keploy to record API calls and replay them as sandboxes for testing your application.

To explore what's available at each tier, visit [keploy.io/pricing](https://keploy.io/pricing).
