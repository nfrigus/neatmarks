const del = require('del')
const manifest = require('./src/manifest')
const mocha = require('gulp-mocha')
const Run = require('gulp-run')
const svg2png = require('svg2png')
const { dest, parallel, series, src } = require('gulp')
const { promisify } = require('util')
const { readFileSync, writeFile } = require('fs')

const { env } = process

const pack = run('crx pack -o dist/dist.crx dist')
const webpack = run('webpack')

const buildAssets = [buildStatic, parallel(buildLogo, buildManifest)]
const buildTasks = [buildAssets, webpack, pack]

const build = series(buildTasks)
const buildClean = series(clean, ...buildTasks)
const buildProd = series(setProductionEnv, clean, ...buildTasks)

module.exports = {
  'build:assets': buildAssets,
  'build:clean': buildClean,
  'build:manifest': buildManifest,
  'build:prod': buildProd,
  'build:webpack': webpack,
  build,
  clean,
  default: buildClean,
  pack,
  test,
}


function buildStatic() {
  return src([
    'src/*.html',
    'src/{_locales,icons}/**/*',
  ], { base: 'src' })
    .pipe(dest('dist'))
}
function buildLogo() {
  // https://stackoverflow.com/a/79114850
  process.env.OPENSSL_CONF = "/dev/null"
  return convertSvg2Pngs({
    dest: 'dist/icons/{size}.png',
    sizes: [16, 32, 48, 64, 128],
    src: 'src/icons/icon.svg',
  })
}
function buildManifest() {
  return manifest.write('dist')
}
async function convertSvg2Pngs({ src, sizes, dest }) {
  const write = promisify(writeFile)
  src = readFileSync(src)

  return Promise.all(sizes.map(size =>
    svg2png(src, { width: size, height: size })
      .then(buffer => write(dest.replace('{size}', size), buffer))))
}

async function test() {
  await setNodeEnv('test')

  return src('{src,test}/**/*.spec.js', { read: false })
    .pipe(mocha({
      reporter: env.MOCHA_REPORTER || 'nyan',
      require: ['test/setup'],
    }))
}

function clean() {
  return del([
    'dist/**/*',
    '!dist/key.pem',
  ])
}
function run(command) {
  const name = command.split(' ').shift()
  return { [name]: () => Run(command).exec() }[name]
}
function setProductionEnv() { return setNodeEnv('production') }
async function setNodeEnv(value) {
  env.NODE_ENV = value
}
