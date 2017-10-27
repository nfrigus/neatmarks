const webpack = require('webpack')


module.exports = {
  devtool: 'source-map',

  entry: {
    background: './src/js/background.js',
    bookmarks: './src/js/bookmarks.js',
    content_script: './src/js/content_script.js',
    options: './src/js/options.js',
    popup: './src/js/popup.js',
  },

  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default'],
      Vue: ['vue/dist/vue.esm.js', 'default'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: isVendorModule,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
}


function isVendorModule({context}) {
  return typeof context === 'string'
    ? context.indexOf('node_modules') !== -1
    : false
}
