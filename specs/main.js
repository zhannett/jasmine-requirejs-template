(function () {
	"use strict";
	
	require.config({ baseUrl: '' });
  require(['../src/requirejs.config'],function(){
    require([
    	"specs/moduleA.spec",
    	"specs/moduleB.spec",
    	], function () {
      window.onload();
    });
  });

})();