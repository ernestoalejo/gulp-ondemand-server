'use strict';

var _ = require('underscore'),
    connect = require('connect'),
    http = require('http'),
    bytes = require('bytes'),
    watch = require('gulp-watch'),
    gulp = require('gulp'),
    httpProxy = require('http-proxy');

function Server() {
  this.scheduledTasks_ = [];
  this.callbacks_ = [];
  this.hosts_ = {};
  this.proxy_ = httpProxy.createProxyServer({});
}

/**
 * Watch files and run some tasks when they're modified.
 * @param {Array|string} globs The glob / globs to watch.
 * @param {Array|string} tasks Task / tasks to run when the files are modified.
 */
Server.prototype.watch = function(globs, tasks) {
  var that = this;

  if (_.isString(tasks)) {
    tasks = [tasks];
  }

  // Watch for changes in files and put the tasks in a queue
  // for later when the requests arrives
  watch({glob: globs}, function() {
    that.scheduledTasks_.push.apply(that.scheduledTasks_, tasks);
    that.scheduledTasks_ = _.uniq(that.scheduledTasks_);
  });

  // Do a first round of tasks at the first request
  this.scheduledTasks_.push.apply(this.scheduledTasks_, tasks);
};

/**
 * Start the development server.
 * @param {number} port Port to listen to.
 */
Server.prototype.start = function(port) {
  var that = this;

  // Prefix all hosts with the port number
  var hosts = {};
  _.each(this.hosts_, function(target, host) {
    hosts[host + ':' + port] = target;
  });
  this.hosts_ = hosts;

  var app = connect()
    .use(connect.logger(this.logger_))
    .use(connect.compress())
    .use(function(req, res) {
      that.serve_(req, res);
    });

  http.createServer(app).listen(port);
};

/**
 * Register a new proxy host.
 * @param {string} host   From host.
 * @param {string} target To URL.
 */
Server.prototype.registerHost = function(host, target) {
  this.hosts_[host] = target;
};

Server.prototype.logger_ = function(tokens, req, res) {
  var status = res.statusCode,
      len = parseInt(res.getHeader('Content-Length'), 10),
      color = 32;

  if (status >= 500) {
    color = 31;
  } else if (status >= 400) {
    color = 33;
  } else if (status >= 300) {
    color = 36;
  }

  len = isNaN(len) ? '' : len = ' - ' + bytes(len);

  return '\x1b[33m' + req.method +
    ' ' + req.originalUrl + ' ' +
    '\x1b[1;' + color + 'm' + res.statusCode +
    ' \x1b[35m' +
    (new Date() - req._startTime) +
    'ms' + len +
    '\x1b[0m';
};

Server.prototype.serve_ = function(req, res) {
  var that = this;

  // Try to see if it's a known host
  var target = this.hosts_[req.headers.host];
  if (!target) {
    res.end('Unrecognized host: ' + req.headers.host + '\n' +
      'Add it using registerHost(...) before starting the server.');
    return;
  }

  // Call this to proxy the request and continue serving the response
  var callback = function() {
    that.proxy_.web(req, res, {target: target});
  };

  // Save the callback for the requests received while the tasks are running
  this.callbacks_.push(callback);
  if (this.callbacks_.length > 1) {
    return;
  }

  // No work: proxy the request right now
  if (!this.scheduledTasks_.length) {
    this.callbacks_.length = 0;
    callback();
    return;
  }

  this.runTasks_(req, res);
};


Server.prototype.runTasks_ = function(req, res) {
  var that = this;
  
  // We insert a new task with a highly strange name, and put the queued
  // tasks as deps. That way we can know when all of them finish and respond
  // the pending requests
  var tasks = this.scheduledTasks_.slice();
  gulp.task('gulp-ondemand-server-finished', tasks, function() {
    // If there are new pending tasks since we started, run them now
    if (that.scheduledTasks_.length) {
      that.runTasks_(req, res);
      return;
    }

    // Call all the waiting callbacks for the requests
    _.each(that.callbacks_, function(fn) {
      fn();
    });

    // Reset lists
    that.callbacks_.length = 0;
  });

  // Clean scheduled tasks
  this.scheduledTasks_.length = 0;

  // Run the tasks
  gulp.start('gulp-ondemand-server-finished');
};

module.exports = Server;

