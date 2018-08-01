const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  dist: resolveApp('dist'),
  files: resolveApp('dist/arquivos'),
  src: resolveApp('src'),
  public: resolveApp('public'),
  checkoutJs: resolveApp('src/js/checkout-custom.js'),
  indexJs: resolveApp('src/js/index.js'),
  root: appDirectory,
  templates: resolveApp('src/pug/templates'),
  subtemplates: resolveApp('src/pug/subtemplates'),
  shelves: resolveApp('src/pug/shelves')
};
