/* globals __dirname, require */
const process = require('process');
const path = require('path');

(function() {
  const Packager = require(path.join(
    process.cwd(),
    'node_modules/xui_app/packager/packager.js'
  ));

  new Packager({
    appFolder: path.join(process.cwd(), 'output') + '/',
    buildsFolder: path.join(process.cwd(), 'output') + '/',
  }).run({
    ext: 'plg',
    buildDev: true,
  });
})();
