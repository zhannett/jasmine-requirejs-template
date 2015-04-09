(function () {
  "use strict";

  define(['moduleA', 'moduleB'], function (moduleA, moduleB) {
    describe('moduleA', function () {

      it("should call moduleB.do_something_else", function () {
      	spyOn(moduleB, 'do_something_else');

        moduleA.do_something();

        expect(moduleB.do_something_else).toHaveBeenCalled();
      });

    });
  });
})();