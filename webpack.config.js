const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const debug = process.env.NODE_ENV !== 'production'
const sourceMap = debug


const plugins_js = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    'window.jQuery': 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default'],
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: isVendorModule,
  }),
  new webpack.optimize.UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap,
    test: /\.js$/,
  }),
]
const plugins = [
  new ExtractTextPlugin("[name].css"),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    DEBUG: false,
  }),
]

const scss_loader = ExtractTextPlugin.extract({
  use: [{
    loader: 'css-loader',
    options: { sourceMap },
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap,
      ident: 'postcss',
      plugins: () => [
        require('precss'),
        require('autoprefixer'),
      ],
    },
  }, {
    loader: 'sass-loader',
    options: { sourceMap },
  }],
})
const rules = [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: /node_modules/,
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        js: 'babel-loader',
      },
    },
  },
  {
    test: /\.scss$/,
    use: scss_loader,
  },
  {
    test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '../fonts/',
        publicPath: '/fonts/',
      },
    }],
  },
]


module.exports = [{
  entry: {
    app: './src/js/app.js',
    background: './src/js/background.js',
    content_script: './src/js/content_script.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/js',
    sourceMapFilename: '[name].js.map',
  },
  plugins: plugins_js,
}, {
  entry: {
    main: './src/css/main.scss',
  },
  output: {
    filename: '[name].css',
    path: __dirname + '/dist/css',
    sourceMapFilename: '[name].css.map',
  },
}].map(makeConfig)


function isVendorModule({ context }) {
  return typeof context === 'string'
    ? /\/node_modules\/.*\.js$/.test(context)
    : false
}
function makeConfig(extend) {
  const config = {
    devtool: 'source-map',
    plugins,
    module: { rules },
  }
  Object.keys(extend).forEach(key => {
    if (Array.isArray(config[key])) {
      config[key] = config[key].concat(extend[key])
    } else {
      config[key] = extend[key]
    }
  })
  return config
}
