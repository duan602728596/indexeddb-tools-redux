const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

module.exports = {
  entry: {
    tests: path.join(__dirname, '../test/tests.js')
  },
  output: {
    path: path.join(__dirname, '../test/build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { // react & js
        test: /^.*\.js$/,
        use: [
          {
            loader: 'happypack/loader',
            options: {
              id: 'babel_loader'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HappyPack({
      id: 'babel_loader',
      loaders: [
        {
          path: 'babel-loader',
          query: {
            cacheDirectory: true,
            presets: ['@babel/react'],
            plugins: [
              '@babel/proposal-decorators',
              '@babel/proposal-object-rest-spread'
            ]
          }
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    })
  ]
};