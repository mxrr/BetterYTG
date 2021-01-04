// Packages
const webpack = require('webpack'),
      path = require('path');

// Webpack Plugins
const CopyPlugin = require('copy-webpack-plugin');

// Paths
const srcPath = path.join(__dirname, 'src'),
      distPath = path.join(__dirname, 'dev-build'),
      node_modulesPath = path.join(__dirname, 'node_modules')

module.exports = {
  mode: 'development',

  resolve: {
    alias: {
      src: srcPath
    }
  },
  context: srcPath,
  entry: {
    content: './content/',
    background: './background/',
    // popup: './popup/',
    options: './options.js',
    setupPage: './setupPage.js'
  },
  output: {
    path: distPath,
    filename: './[name].js'
  },

  module: {
    rules: [
      { test: /\.styl$/, use: ['style-loader', 'css-loader', 'stylus-loader'], exclude: /node_modules/ }
    ]
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.join(srcPath, 'html'), to: path.join(distPath, 'html')},
        { from: path.join(srcPath, 'assets'), to: path.join(distPath, 'assets'),
          globOptions: {
            ignore: [
              '**/*.psd'
            ]
          }
        },
        { from: path.join(srcPath, 'manifest.json'), to: path.join(distPath, 'manifest.json')}
      ]
    })
  ],

  devtool: 'inline-cheap-source-map'
}
