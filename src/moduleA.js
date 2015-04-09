(function(){
	"use strict";

	define(['moduleB'], function(moduleB){
		function do_something(){
			var x = moduleB.do_something_else(40, 2);
			moduleB.dom_example(x);
		}

		return {
			do_something: do_something
		}
	});

})();