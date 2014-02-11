'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
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

gulp.task('foo', function(cb) {
  setTimeout(function() {
    gutil.log('foo task');
    cb();
  }, 5000);
});

gulp.task('bar', function() {
  return gulp.src('fixtures/bad-format.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/* jshint unused:vars */
gulp.task('test', function(cb) {
  var Server = require('./index');

  var server = new Server();
  server.watch('*.js', ['foo']);
  server.watch('fixtures/*.js', ['bar']);
  server.registerHost('hotels.localhost', 'http://hotels.localhost');
  server.start(9810);
});
/* jshint unused:true */
