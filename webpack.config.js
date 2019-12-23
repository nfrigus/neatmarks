const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')

const debug = process.env.NODE_ENV !== 'production'
const sourceMap = debug


const plugins = [
  new MiniCssExtractPlugin(),
  new VueLoaderPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEBUG: debug,
  }),
]

const rules = [{
  enforce: "pre",
  exclude: /node_modules/,
  loader: "eslint-loader",
  options: { fix: true },
  test: /\.(js|vue)$/,
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
    options: { prefix: false },
  }],
}, {
  test: /\.s?css$/,
  use: [{
    loader: MiniCssExtractPlugin.loader,
    options: { esModule: true },
  }, {
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
}, {
  test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      esModule: false,
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
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
}].map(makeConfig)


function makeConfig(extend) {
  const config = {
    devtool: debug ? 'inline-source-map' : false,
    mode: debug ? 'development' : 'production',
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
