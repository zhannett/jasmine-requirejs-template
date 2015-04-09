(function(){
	"use strict";

	define(['jquery', 'Mustache'], function($, Mustache){
		function do_something_else(x, y){
			return (x + y);
		}

		function dom_example(variable){
			var template = $('script#template').html();
			var html = Mustache.render(template, {
				result: variable
			});
	
      $("div#hello-container").append(html);
		}

		return {
			do_something_else: do_something_else,
			dom_example: dom_example
		}
	});

})();