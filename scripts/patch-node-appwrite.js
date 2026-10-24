const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'node_modules', 'node-appwrite', 'package.json');
if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let changed = false;
    if (pkg.exports && pkg.exports['.']) {
      if (pkg.exports['.']['import'] && pkg.exports['.']['import'].endsWith('.mjs')) {
        pkg.exports['.']['import'] = './dist/index.js';
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log('[postinstall] Successfully patched node-appwrite exports.import');
    }
  } catch (err) {
    console.warn('[postinstall] Note on node-appwrite patch:', err.message);
  }
}
