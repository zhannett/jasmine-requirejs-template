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