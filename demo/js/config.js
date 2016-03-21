require.config({ //jshint ignore:line
	baseUrl: '/calculator/demo',
    paths: {
        lodash: '/js/lodash',
        app: '/js/app'
    },
    shim: {
        'app': {
            deps: ['lodash']
        }
    }
});
