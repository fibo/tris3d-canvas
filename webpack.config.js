var path = require('path')

module.exports = {
  entry: './example.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'gh-pages', 'example'),
    filename: 'bundle.js'
  }
}
