var path = require('path');

var clientConfig = {
  entry: path.join(__dirname, 'src', 'react.js'),
  output: {
    path: path.join(__dirname, 'src','server','public', 'js'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx', '.json', 'index.json']
  },
  module: {
    preLoaders: [
        { test: /\.json$/, loader: "json-loader"},
    ],
    loaders: [
      {
        include: path.join(__dirname, 'src'),
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      },
      {
        include : path.join(__dirname),
        test: /\.s?css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}

module.exports = [clientConfig];
