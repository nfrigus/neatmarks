const del = require('del')
const gulp = require('gulp')
const manifest = require('./src/manifest')
const svg2png = require('svg2png')
const {exec} = require('child_process')
const {promisify} = require('util')
const {readFileSync, writeFile} = require('fs')


gulp.task('clean', () => del([
  'dist/**/*',
  '!dist/key.pem',
]))
gulp.task('assets', () => gulp.src([
    'src/*.html',
    'src/{_locales,icons}/**/*',
  ], {base: 'src'})
  .pipe(gulp.dest('dist')))
gulp.task('icon', ['assets'], () => convertSvg2Pngs({
  dest: 'dist/icons/{size}.png',
  sizes: [16, 32, 48, 64, 128],
  src: 'src/icons/icon.svg',
}))
gulp.task('manifest', ['assets'], () => manifest.write('dist'))
gulp.task('webpack', run('npm run build:webpack'))
gulp.task('crx', [
  'assets',
  'icon',
  'manifest',
  'webpack',
], run('npm run build:crx'))
gulp.task('build', ['crx'])
gulp.task('build:clean', ['clean'], () => gulp.start('build'))
gulp.task('build:prod', run('npm run build:prod'))

gulp.task('default', ['build:clean'])

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

function run(command) {
  return cb => exec(command, (err, stdout, stderr) => {
    console.log(stdout)
    console.error(stderr)
    cb(err)
  })
}
