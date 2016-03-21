require.config({ //jshint ignore:line
	baseUrl: 'http://uladzimirkuzmin.github.io/calculator/demo/',
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
