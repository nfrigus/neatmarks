const gulp = require('gulp')
const del = require('del')
const {exec} = require('child_process')

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

gulp.task('default', [
  'clean',
  'copy',
  'pack',
])
