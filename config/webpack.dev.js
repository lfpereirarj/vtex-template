const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const templates = require('./templates').templates;

const PROJECT_VARS = require('./variables');
const paths = require('./paths');

module.exports = merge(common, {
  entry: {
    [PROJECT_VARS.PROJECT_ID]: ['./config/polyfills.js', paths.indexJs]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: paths.public,
    hot: true
  },
  plugins: [
    ...templates,
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: (/\.(css|scss)$/),
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('css-mqpacker')({ sort: true }),
                require('autoprefixer')({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9'
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          require.resolve('sass-loader'),
        ]
      }
    ]
  }
});
