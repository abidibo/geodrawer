var path = require('path')

module.exports = {
  /**
   * this is needed to resolve imports from the js root
   */
  resolve: {
    root: 'src/js',
    extensions: ['', '.js', '.json']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  // library entry point
  entry: './src/js/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'geodrawer.js'
  },
  // this for creating source maps
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
}
