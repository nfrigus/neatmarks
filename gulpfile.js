const del = require('del')
const gulp = require('gulp')
const svg2png = require('svg2png')
const webpack = require('webpack-stream')(require('./webpack.config'))
const {exec} = require('child_process')
const {promisify} = require('util')
const {readFileSync, writeFile} = require('fs')


gulp.task('clean', () => del([
  'dist/**/*',
  '!dist/key.pem',
]))
gulp.task('assets', ['clean'], () => gulp.src([
    'src/**/*',
    '!src/js/**/*',
  ], {base: 'src'})
  .pipe(gulp.dest('dist')))
gulp.task('icon', ['clean'], () => convertSvg2Pngs({
  dest: 'dist/icons/{size}.png',
  sizes: [16, 48, 128],
  src: 'src/icons/icon.svg',
}))
gulp.task('js', ['clean'], () => gulp.src('src')
  .pipe(webpack)
  .pipe(gulp.dest('dist/js/')))
gulp.task('crx', [
  'assets',
  'icon',
  'js',
], cb => exec('npm run pack', (err, stdout, stderr) => {
  console.log(stdout)
  console.error(stderr)
  cb(err)
}))

gulp.task('default', [
  'assets',
  'clean',
  'crx',
  'icon',
  'js',
])

async function convertSvg2Pngs({
  src,
  sizes,
  dest,
}) {
  const write = promisify(writeFile)
  src = readFileSync(src)

  return Promise.all(sizes.map(size =>
    svg2png(src, {width: size, height: size})
      .then(buffer => write(dest.replace('{size}', size), buffer))))
}
