require.config({ //jshint ignore:line
  paths: {
    lodash: '/calculator/demo/js/lodash',
    app: '/calculator/demo/js/app'
  },
  shim: {
    'app': {
        deps: ['lodash']
    }
  }
});
