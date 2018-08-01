const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('./paths');
const PROJECT_VARS = require('./variables');

module.exports = {
  plugins: [
    new InterpolateHtmlPlugin(PROJECT_VARS),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new CopyWebpackPlugin([ { from: paths.public, to: paths.dist } ])
  ],
  output: {
    filename: 'arquivos/[name].min.js',
    path: paths.dist,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: {
          pretty: true
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'arquivos/'
          }
        }
      },
      {
        test: /\.svg/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
