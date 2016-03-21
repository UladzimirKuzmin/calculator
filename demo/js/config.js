require.config({ //jshint ignore:line
	baseUrl: 'http://localhost:8888',
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
