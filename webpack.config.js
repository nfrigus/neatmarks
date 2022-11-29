const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const debug = process.env.NODE_ENV !== 'production'
const sourceMap = debug


const rules = [{
  test: /\.mjs$/,
  include: /node_modules/,
  type: "javascript/auto",
}, {
  enforce: "pre",
  exclude: /node_modules/,
  loader: "eslint-loader",
  options: { fix: true },
  test: /\.(js|vue|ts)$/,
}, {
  test: /\.vue$/,
  use: ['vue-loader'],
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
    loader: 'sass-loader',
    options: { sourceMap },
  }],
}, {
  test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
  type: 'asset/resource',
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
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: debug,
    }),
  ],
  resolve: { extensions: ['.ts', '.js', '.vue', '.json'] },
}
