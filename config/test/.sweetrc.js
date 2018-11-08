import path from 'path';

export default {
  frame: 'react',
  dll: ['react', 'react-dom'],
  entry: {
    app: [path.join(__dirname, '../../test/app.js')]
  },
  output: { publicPath: '/' },
  externals: {
    mocha: 'window.mocha',
    chai: 'window.chai'
  },
  rules: [
    {
      test: /(mocha|chai|dll\.js)/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'script/'
        }
      }]
    }
  ],
  js: {
    include: /(src|test|lib)/,
    exclude: /(node_modules|mocha|chai)/
  },
  css: { exclude: /mocha/ },
  html: [{ template: path.join(__dirname, '../../test/index.pug') }]
};