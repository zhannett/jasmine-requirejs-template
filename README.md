## Jasmine / Karma / RequireJS Template

I was playing around jasmine for a project, all basic setup and defining tests are easy as mocha and relatively easy compared to qunit. The problem is testing encapsulated code like immediately executed functions. So i've created this template to provide a boilerplate, which needed in my opinion because there are a lot of not working, not documented or simply bad examples out there.

I'll try to keep this document like a walk-through guide. Boilerplate is here [https://github.com/vngrs/jasmine-requirejs-template](https://github.com/vngrs/jasmine-requirejs-template)

### Setting up base project

This will create our base project and install base packages.

```bash
npm init
npm install karma bower grunt --save-dev
```

This will create our jasmine - karma setup

```bash
karma init
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
bower init # default answers should do.
```

### Sample Project

* Install required assets
* An entry point to our web site
* A boot-up file
* A custom js module "A"
* Another custom js module "B" that depends on "A"
* Both modules will depend on other modules like jQuery, Mustache etc..

#### Bower

```shell
bower install requirejs jquery mustache --save
```

Note the --save argument. This will make bower to write installed modules to bower.json also.

#### Entry point

In our example that will be index.html and it will contain requirejs loader.

```html
<script data-main="src/app.config.js" src="bower_components/requirejs/require.js"></script>
```

Notice the data-main attribute, that will load our boot file.

#### Bootup File

	This is where we setting up requirejs and optionally use as startup point

```javascript
// Basic usage
(function(){
    require.config({
        baseUrl: '',
        paths: { },
        shim: { }
    });

    require(['moduleA'],function(a){
        a.execute_a_cool_function();
    });
})();

// Nested require method
// Using a common setup file for specs and sources
(function(){
    require(['requirejs_config_file'], function(){
        require(['moduleA'],function(a){
            a.execute_a_cool_function();
        });
    });
})();
```

##### baseUrl

This is for loader paths, you may either use blank or define as src/ and move everything under src folder.

##### paths

If you're defining paths for modules, this is the place. Defining jquery for example:

```javascript
'jquery': 'bower_components/jquery/dist/jquery'
```

##### shim

> shim: Configure the dependencies, exports, and custom initialization for older, traditional "browser globals" scripts that do not use define() to declare the dependencies and set a module value.

For example, to use use Mustache properly :
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

#### Module definitions

Sample module definition. This will define your module with required dependencies and export your module.

```javascript
// moduleA.js
define(['dependency1','dependency2','etc..'], function(dep1, dep2){

});

// moduleB.js
define(['moduleA'], function(a){

});
```

### Writing specs

##### Write test ready code

```javascript
// THIS IS WRONG
// Testing this code will be nightmare
function do_something(){
    $.ajax({
        url: '/some/end/point',
        success: function(){
            $('div.meow')
                .show()
                .on('focus', function(){
                    $('div.bark_bark').show();
                });
        },
        complete: function(){
            $('div.meow').hide();
        }
    })
}

// THIS IS FINE
function do_something(){
    $.ajax({
        url: '/some/end/point',
        success: something_success,
        complete: something_complete
    });
}
function something_success(){
    $('div.meow')
        .show()
        .on('focus', meow_on_focus);
}
function meow_on_focus(){
    $('div.bark_bark').show();
}
function something_complete(){
    $('div.meow').hide();
}
```

##### Export your functions to public

```javascript
(function(){
    "use strict";

    define(['jquery'], function($){
        function do_something(){}

        // This way we can easly access do_something method from outside
        return {
            do_something: do_something
        }
    });

})();
```

##### Use requirejs to load modules for tests

```javascript
(function(){
    "use strict";
    
    define(['src/moduleA'], function (moduleA) {
        describe('moduleA', function () {
            // Usual specs
        });
    });
})();
```

### Running local development server

This command will lunch webserver that listens to [http://localhost:3000](http://localhost:3000)
```bash
node_modules/grunt-cli/bin/grunt
```

### Run Specs in Browser

For this job you need to include jasmine files and require a bootstrap file to run specs.

We will use same nested require approach to use existing requirejs config

```javascript
(function () {
    "use strict";
  
    require.config({ baseUrl: '' });  
    require(['../src/requirejs.config'], function (){
        require(["specs/moduleA.spec"], function () {
          window.onload(); // Sadly this is a necessary trick to run jasmine specs.
        });
    });
})();
```

[http://localhost:3000/run_specs.html](http://localhost:3000/run_specs.html)
Will give you test results.

### Run Specs in CI

We need to modify origin test-main file to run with common requirejs config file.

```javascript
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
karma start

# This will start karma server and browsers
karma start --no-single-run &
# This will run your tests
karma run
```