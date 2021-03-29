const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const debug = process.env.NODE_ENV !== 'production'
const sourceMap = debug


const rules = [{
  enforce: "pre",
  exclude: /node_modules/,
  loader: "eslint-loader",
  options: { fix: true },
  test: /\.(jsx?|vue|tsx?)$/,
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
  }],
}, {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  options: {
    appendTsSuffixTo: [/\.vue$/],
  },
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
      outputPath: 'fonts/',
    },
  }],
}]


module.exports = {
  entry: {
    app: './src/app/app.ts',
    background: './src/app/background/index.ts',
    content_script: './src/app/content_script.ts',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/js',
    sourceMapFilename: '[name].js.map',
  },
  devtool: debug ? 'inline-source-map' : false,
  mode: debug ? 'development' : 'production',
  module: { rules },
  plugins: [
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      DEBUG: debug,
    }),
  ],
  resolve: { extensions: ['.ts', '.js', '.vue', '.json'] },
}
