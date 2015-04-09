require.config({
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    Mustache: 'bower_components/mustache/mustache',
    moduleA: 'src/moduleA',
    moduleB: 'src/moduleB'
  },
  shim: {
    Mustache: { exports: 'Mustache' }
  }
});