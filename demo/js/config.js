require.config({ //jshint ignore:line
	baseUrl: '/',
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
