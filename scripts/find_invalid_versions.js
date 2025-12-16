const fs = require('fs');
const path = require('path');
function readJSON(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ return null; }}
const root = process.cwd();
console.log('Scanning package.json...');
const pkg = readJSON(path.join(root,'package.json'));
if(!pkg){ console.error('Could not read root package.json'); process.exit(2); }
const deps = {...pkg.dependencies, ...pkg.devDependencies};
let found = false;
for(const [k,v] of Object.entries(deps)){
  if(typeof v !== 'string' || v.trim() === ''){
    console.log('BAD_DEP_VERSION', k, JSON.stringify(v)); found = true;
  }
}
console.log('Scanning plugins for package.json files...');
const pluginsDir = path.join(root,'plugins');
if(fs.existsSync(pluginsDir)){
  for(const name of fs.readdirSync(pluginsDir)){
    const p = path.join(pluginsDir,name,'package.json');
    if(fs.existsSync(p)){
      const sub = readJSON(p);
      if(!sub || !sub.version || sub.version.trim()===''){
        console.log('BAD_PLUGIN_VERSION', name, p, sub && sub.version);
        found = true;
      }
    } else {
      // plugins may not have package.json which is fine
    }
  }
}
if(!found) console.log('No obvious empty or non-string versions found.');
