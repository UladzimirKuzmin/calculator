require.config({ //jshint ignore:line
	paths: {
        lodash: '/calculator/demo/lodash',
        app: '/calculator/demo/app'
    },
    shim: {
        'app': {
            deps: ['lodash']
        }
    }
});
