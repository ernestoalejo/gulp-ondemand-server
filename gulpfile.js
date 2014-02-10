
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    mocha = require('gulp-mocha');

gulp.task('default', function() {
  gutil.log(gutil.colors.red('Specify a task'));
});

gulp.task('test', function() {
  return gulp.src('*.js')
    .pipe(mocha());
});

gulp.task('lint', function() {
  return gulp.src('*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});
