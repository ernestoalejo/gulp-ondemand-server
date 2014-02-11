
# gulp-ondemand-server

> Runs a local server that executes tasks when a page is requested, not when the file changes


## Installation

Install via [npm](https://npmjs.org/package/gulp-ondemand-server):

```
npm install gulp-ondemand-server --save-dev
```


## Example

```js
var gulp = require('gulp'),
    OnDemandServer = require('gulp-ondemand-server');

gulp.task('default', function() {
  var server = new OnDemandServer();

  // You can register a pattern of files to watch and the task to execute
  // when they change and a request arrive.
  server.watch('**/*.js', 'lint');

  // You can watch arrays of patterns, and execute arrays of tasks.
  server.watch(['styles/*.scss', 'styles/*.sass'], ['sass', 'autoprefixer']);

  // You should register the host you need, as well as the target URL
  // they're proxying.
  // For example to redirect everything from localhost:9810 ---> localhost:80
  server.registerHost('localhost', 'http://localhost');

  // You can have several hosts registered, as long as they share the proxy port
  // This will redirect http://mydomain.localhost:9810 ---> foo:80
  server.registerHost('mydomain.localhost', 'http://foo');

  // Another example: example-local:9810 ---> localhost:7653
  server.registerHost('example-local', 'http://localhost:7653');

  // Start listening in this port
  server.start(9810);
});
```


