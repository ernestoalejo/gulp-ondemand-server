
# gulp-ondemand-server

> Runs a local server that executes tasks when a page is requested, not when the files change

It will keep track of the file changes; but instead of running the tasks directly it will run them all at once when a request arrives, before it hits the real development server.

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

**NOTE**: If you want custom local domains in Linux, you can edit /etc/hosts and copy-paste the localhost line with the new domain.


## API

### watch(globs, tasks)

 * `globs` - array of globs of files to watch for changes.
 * `tasks` - array of tasks to run when a requests arrive and the files have changed.

Both globs and tasks can be a single string too.

### registerHost(host, proxyUrl)

  * `host` - the host we're registering
  * `proxyUrl` - the target URL for the proxy; protocol, host and port only. E.g.: `http://localhost:5623`

You should register all hosts you want to use before starting the server (calling this function as much as needed).

### start(port)

 * `port` - the port we'll listen to

All registered hosts will share this port.



## Why?

Mainly because I have a not-so-good laptop that doesn't keep up compiling every time I change the Sublime tab (and autosaves).

With this plugin I can develop and save as much as I want, and it will execute only the needed tasks before any request hits the real page (when I refresh the page).
