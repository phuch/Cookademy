//webpack.config.js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0'
        ]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }]
  }
};