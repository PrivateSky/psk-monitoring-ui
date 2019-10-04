const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

const WCModulesPath = path.resolve(path.join(__dirname), '..', 'node_modules', 'pskwebcomponents');

if(!fs.existsSync(WCModulesPath)) {
  childProcess.execSync(`git clone https://github.com/PrivateSky/pskwebcomponents.git ${WCModulesPath}`);
}

childProcess.execSync(`cd ${WCModulesPath} && npm run build`);

