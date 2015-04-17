## Jasmine / Karma / RequireJS Template

I was playing around jasmine for a project, all basic setup and defining tests are easy as mocha and relatively easy compared to qunit. The problem is testing encapsulated code like immediately executed functions. So i've created this template to provide a boilerplate, which needed in my opinion because there are a lot of not working, not documented or simply bad examples out there.

Template is here [https://github.com/vngrs/jasmine-requirejs-template](https://github.com/vngrs/jasmine-requirejs-template). This document serves as a guide and explains the structure by recreating it.

### Setting up base project

I'm using npm to create our base project and install base packages. Only prerequisites are *git* and *npm*. 

```bash
mkdir test-project && cd test-project
npm init
npm install karma bower grunt --save-dev
```

Then karma will create our base jasmine - karma setup.

```bash
./node_modules/karma/bin/karma init
```

* Which testing framework do you want to use ?

> jasmine

* Do you want to use Require.js ?

> yes

* Do you want to capture any browsers automatically ?

> PhantomJS (Choose only PhantomJS *(headless browser with JavaScriptCore, Ecma 5.1)* if you're planning to prepare this setup for continous integration environment)

* What is the location of your source and test files ?

> src/\*.js (you may use 'src/\*\*/\*.js' to recursively match files)

> spec/*.spec.js

* Should any of the files included by the previous patterns be excluded ?

> blank

* Do you wanna generate a bootstrap file for RequireJS?

> yes

* Do you want Karma to watch all the files and run the tests on change ?

> no (again for CI purposes)

```bash
./node_modules/bower/bin/bower init # default answers should do.
```

And *bower* install our assets.

```shell
./node_modules/bower/bin/bower install requirejs jquery mustache --save
```

Note the --save argument. This will make bower to write installed modules to bower.json also.

### Providing An Entry point

In our example that will be index.html and it will contain requirejs loader.

```html
<!-- /index.html -->
<html>
<head>
    <title>jasmine-requirejs-template</title>
    <script data-main="src/app.config.js" src="bower_components/requirejs/require.js"></script>
</head>
.
.
.
```

Notice the *data-main* attribute, requirejs is going to read this attribute and load specified file after loading itself.

### Requirejs Bootup File

This is where we're setting up requirejs and optionally use as startup point. Note that, this is the file that we've used in *data-main* attribute so, requirejs will load this file right after itself.

I'm going to use a separate file to configure requirejs and load it with nested *require* functions.

```javascript
// src/app.config.js

// Using a common setup file for specs and sources
(function(){
    require(['src/requirejs.config'], function(){
        require(['moduleA'],function(a){
            a.execute_a_cool_function();
        });
    });
})();
```

```javascript
// src/requirejs.config.js

// This is a common config file for all our requirejs setups, we're going to
// use same file while running our specs in browser or in karma.
require.config({
  paths: { 
    // assets installed with bower
    jquery: 'bower_components/jquery/dist/jquery',
    Mustache: 'bower_components/mustache/mustache',
    // our modules
    moduleA: 'src/moduleA',
    moduleB: 'src/moduleB'
  },
  shim: {
    Mustache: { exports: 'Mustache' }
  }
});
```

##### Important variables in requirejs config

##### baseUrl

This is for loader paths, you may either use blank or define as src/ and move everything under src folder.

##### paths

If you're defining paths for modules, this is the place. Defining jquery for example:

```javascript
'jquery': 'bower_components/jquery/dist/jquery'
```

##### shim

> shim: Configure the dependencies, exports, and custom initialization for older, traditional "browser globals" scripts that do not use define() to declare the dependencies and set a module value.

For example, to use Mustache properly :
```javascript
{
	paths: {
		'Mustache': 'bower_components/mustache/mustache',
	},
	shim: {
		'Mustache': { exports: 'Mustache' }
	}
}
```

### Defining Modules and Dependencies

This sample shows our basic module definitions. Requirejs will handle dependencies.

```javascript
// src/moduleA.js

define(['dependency1','dependency2','etc..'], function(dep1, dep2){

});
```

```javascript
// src/moduleB.js

define(['moduleA'], function(a){

  function do_something(){}

  function do_something_else(){}


  // It's impossible to run specs on private methods, so you need to 
  // change your interface and export your private methods. But it's 
  // possible to remove these unwanted lines with grunt tasks while 
  // generating production ready assets.

  return {
      do_something: do_something,
      do_something_else: do_something_else
  }
});
```

### Running local development server

This command will lunch webserver that listens to [http://localhost:3000](http://localhost:3000)
```bash
./node_modules/grunt-cli/bin/grunt
```


### Sample Spec Definition

```javascript
// spec/moduleA.spec.js

(function () {
  "use strict";

  define(['moduleA', 'moduleB'], function (moduleA, moduleB) {
    describe('moduleA', function () {

      it("do_something should call moduleB.do_something_else", function () {
        spyOn(moduleB, 'do_something_else');

        moduleA.do_something();

        expect(moduleB.do_something_else).toHaveBeenCalled();
      });

    });
  });
})();
```

#### Running Specs in Browser

For this job you need to include jasmine files and require a bootstrap file to run specs.

This html file will load jasmine libraries and load our specs with requirejs.

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" type="text/css" href="bower_components/jasmine/lib/jasmine-core/jasmine.css">

  <script type="text/javascript" src="bower_components/jasmine/lib/jasmine-core/jasmine.js"></script>
  <script type="text/javascript" src="bower_components/jasmine/lib/jasmine-core/jasmine-html.js"></script>
  <script type="text/javascript" src="bower_components/jasmine/lib/jasmine-core/boot.js"></script>
  <!-- notice data-main attribute, specs/main is another requirejs boot file -->
  <script type="text/javascript" data-main="specs/main" src="bower_components/requirejs/require.js"></script>
</head>
<body>
</body>
</html>
```

We will use same nested require approach to use existing requirejs config

```javascript
// specs/main.js

(function () {
    "use strict";
  
    require.config({ baseUrl: '' });  
    // using same config file
    require(['../src/requirejs.config'], function (){
        require(["specs/moduleA.spec"], function () {
          window.onload(); // Sadly this is a necessary trick to run jasmine specs.
        });
    });
})();
```

[http://localhost:3000/run_specs.html](http://localhost:3000/run_specs.html)
Opening this url in browser will give you test results.

#### Running Specs in CI

We need to modify origin test-main file to run with common requirejs config file.

```javascript
// /test-main.js

(function () {
    "use strict";
    
    require(['/base/src/requirejs.config.js'],function(){
        require.config({ baseUrl: '/base' });
        var allTestFiles = [];

        Object.keys(window.__karma__.files).forEach(function(file) {
            if (file.match(/(.+)\.spec\.js$/)) {
                allTestFiles.push(file);
            }
        });

        require(allTestFiles, window.__karma__.start);
    });
})();
```

```shell
# This will start and run your tests once, useful in CI environments
./node_modules/karma/bin/karma start

# This will start karma server and browsers
./node_modules/karma/bin/karma start --no-single-run &
# This will run your tests
./node_modules/karma/bin/karma run
```