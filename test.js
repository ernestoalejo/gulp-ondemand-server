'use strict';

var assert = require('assert'),
    Server = require('./index');

describe('gulp-ondemand-server', function() {
  it('should start', function() {
    var server = new Server();
    server.start('hotels.localhost', 9810, 'hotels.localhost', 80);
  });
});
