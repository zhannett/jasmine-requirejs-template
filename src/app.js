(function () {

	require.config({ baseUrl: '' });
  require(['src/requirejs.config'],function(){
    require(['moduleA'], function (a) {
      a.do_something();
    });
  });
  
})();