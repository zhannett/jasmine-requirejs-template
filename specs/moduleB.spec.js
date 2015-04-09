(function () {
  "use strict";

  define(['moduleB', 'Mustache'], function (moduleB, Mustache) {
    describe('moduleB', function () {

      it("do_something_else, should sum up values", function () {
      	var return_val = moduleB.do_something_else(40, 2);
      	expect(return_val).toBe(42);
      });

      it("should render template and add to dom", function(){
      	var template = "<span>{{test}}</span>";

				spyOn(Mustache, 'render').and.returnValue('ola');
				spyOn($.fn, 'html').and.returnValue(template);
				spyOn($.fn, 'append');

      	moduleB.dom_example('hello');

      	expect(Mustache.render).toHaveBeenCalledWith(template, {result: 'hello'});
      	expect($.fn.append.calls.argsFor(0)[0]).toBe('ola');
      });
    });
  });
})();