require.config({ //jshint ignore:line
	baseUrl: 'js',
    paths: {
        lodash: '/lodash',
        app: '/app'
    },
    shim: {
        'app': {
            deps: ['lodash']
        }
    }
});
