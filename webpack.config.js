const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const debug = process.env.NODE_ENV !== 'production'
const sourceMap = debug


const plugins = [
  new ExtractTextPlugin("[name].css"),
  new webpack.EnvironmentPlugin({
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEBUG: debug,
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
const rules = [{
  enforce: "pre",
  exclude: /node_modules/,
  loader: "eslint-loader",
  test: /\.(js|vue)$/,
  options: {
    fix: true,
  },
}, {
  test: /\.js$/,
  use: ['babel-loader'],
  exclude: /node_modules/,
}, {
  test: /\.vue$/,
  use: [{
    loader: 'vue-loader',
    options: {
      loaders: {
        js: 'babel-loader',
      },
    },
  }, {
    loader: 'iview-loader',
    options: {
      prefix: false,
    },
  }],
}, {
  test: /\.s?css$/,
  use: scss_loader,
}, {
  test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: '../fonts/',
      publicPath: '/fonts/',
    },
  }],
}]


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
}].map(makeConfig)


function isVendorModule({ context }) {
  return typeof context === 'string'
    ? /\/node_modules\/.*\.js$/.test(context)
    : false
}
function makeConfig(extend) {
  const config = {
    devtool: debug ? 'inline-source-map' : false,
    module: { rules },
    plugins,
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
