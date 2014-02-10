'use strict';

var _ = require('underscore'),
    connect = require('connect'),
    http = require('http'),
    bytes = require('bytes');

function Server() {

}

Server.prototype.watch = function(globs, tasks) {
};

Server.prototype.start = function(fromHost, fromPort, toHost, toPort) {
  var that = this;

  var app = connect()
    .use(connect.logger(this._logger))
    .use(connect.compress())
    .use(function(req, res, next) {
      that._serve(req, res, function(err) {
        if (err) {
          res.end('ERROR RUNNING TASKS: see console for more info [' + err + ']');
          return;
        }
        next();
      });
    });

  http.createServer(app).listen(fromPort);
};

Server.prototype._logger = function(tokens, req, res) {
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

Server.prototype._serve = function(req, res, err) {
  res.end('Hello world!');
};

module.exports = Server;

