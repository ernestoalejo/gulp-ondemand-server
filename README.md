
# gulp-ondemand-server

> Runs a local server that executes tasks when a page is requested, not when the files change

It will keep track of the file changes; but instead of running the tasks directly it will run them when a request arrives, before it hits the real development server.

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
  // For example to proxy everything from localhost:9810 ---> localhost:80
  server.registerHost('localhost', 'http://localhost');

  // You can have several hosts registered, as long as they share the proxy port
  // This will proxy http://mydomain.localhost:9810 ---> foo:80
  server.registerHost('mydomain.localhost', 'http://foo');

  // Another example: example-local:9810 ---> localhost:7653
  server.registerHost('example-local', 'http://localhost:7653');

  // Start listening in this port
  server.start(9810);
});
```

**NOTE**: If you want custom local domains in Linux, you can edit /etc/hosts
and copy-paste the localhost line with the new domain.


## Why?

Mainly because I have a not-so-good laptop that doesn't keep up compiling
every time I change the Sublime tab (and autosaves).

With this plugin I can develop and save as much as I want, and it will execute
only the needed tasks before any request hits the real page.
