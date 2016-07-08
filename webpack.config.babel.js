import webpack from 'webpack'
var path = require('path')

module.exports = {
  node: {
    fs: 'empty'
  },
  // this is needed to resolve imports from the js root
  resolve: {
    // always import from root (src/js and node_modules)
    root: [
      'src/js',
      'node_modules'
    ],
    extensions: ['', '.js', '.json']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  // library entry point
  entry: './src/js/geodrawer.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'geodrawer.js'
  },
  // this for creating source maps
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
}
