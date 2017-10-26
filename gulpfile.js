const del = require('del')
const gulp = require('gulp')
const {exec} = require('child_process')
const svg2png = require('svg2png')
const {readFileSync, writeFile} = require('fs')
const {promisify} = require('util')

gulp.task('clean', () => {
  return del([
    'dist/**/*',
    '!dist/key.pem',
  ])
})
gulp.task('copy', () => {
  return gulp.src([
      'src/**/*',
    ], {base: 'src'})
    .pipe(gulp.dest('dist'))
})
gulp.task('pack', function (cb) {
  exec('npm run pack', function (err, stdout, stderr) {
    console.log(stdout)
    console.error(stderr)
    cb(err)
  })
})
function conertSvg(src, size) {
  return svg2png(src, {width: size, height: size})
    .then(buffer => promisify(writeFile)('dist/icons/' + size + '.png', buffer))
}
gulp.task('icon', () => {
  const src = readFileSync('dist/icons/icon.svg')
  ;[16, 48, 128].forEach(size => conertSvg(src, size))
})

gulp.task('default', [
  'clean',
  'copy',
  'icon',
  'pack',
])
