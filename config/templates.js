const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const prod = process.env.NODE_ENV === 'production'

const getPugPlugins = (dir, output) =>
  fs.readdirSync(dir)
    .filter(str => prod ? str[0] !== "_" : true)
    .map(filename => new HtmlWebpackPlugin({
        inject: prod ? false : true,
        filename: `${prod ? output + '/' : ''}${filename.replace('pug', 'html')}`,
        template: `${dir}/${filename}`,
        alwaysWriteToDisk: prod ? true : false
      }));

const getCheckoutPugPlugins = () =>
  fs.readdirSync(paths.subtemplates)
    .filter(str => ~str.indexOf('checkout'))
    .map(filename => new HtmlWebpackPlugin({
        inject: prod ? false : true,
        filename: `checkout/${filename.replace('pug', 'html')}`,
        template: `${paths.subtemplates}/${filename}`,
        alwaysWriteToDisk: prod ? true : false
      }));

let templates = getPugPlugins(paths.templates, 'templates')
let checkout = getCheckoutPugPlugins()

if (prod) {
  const subtemplates = getPugPlugins(paths.subtemplates, 'subtemplates')
  const shelves = getPugPlugins(paths.shelves, 'shelves')
  templates = templates.concat(subtemplates, shelves)
}

module.exports = {
  templates,
  checkout
}
