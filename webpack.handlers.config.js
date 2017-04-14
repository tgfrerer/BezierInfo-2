var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

// Bundle entry point
var entry = ['./lib/site/handlers.js'];

// Bundle output
var output = {
  path: path.join(__dirname, 'lib', 'site'),
  filename: 'handlers.bundle.js',
  library: 'BezierSectionHandlers',
  libraryTarget: 'umd'
};

// Necessary webpack loaders for converting our content:
var webpackLoaders = [ 'babel-loader' ];

// And the final config that webpack will read in.
module.exports = {
  entry,
  output,
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: webpackLoaders
      }
    ]
  }
};
