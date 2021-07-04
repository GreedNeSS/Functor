'use strict';

const fp = {};

fp.path = data => path => fp.maybe(path)(path => (
	path.split('.').reduce(
		(path, key) => (path[key] || {}),
		(data || {})
	)
));


fp.maybe = x => fn => fp.maybe(x && fn ? fn(x) : null);

// Usage

const fs = require('fs');

const config = {
	server: {
		host: {
			ip: '10.0.0.1',
			post: 3000,
		},
		ssl: {
			key: {
				filename: './7-path.js'
			}
		}
	}
};

// Imperative style

if (
	config &&
	config.server &&
	config.server.ssl &&
	config.server.ssl.key &&
	config.server.ssl.key.filename
) {
	const filename = config.server.ssl.key.filename;
	fs.readFile(filename, 'utf8', (err, val) => {
		if (val) {
			console.log();
		}
	})
}

// Functional style

fp.path(config)('server.ssl.key.filename')(
	file => fs.readFile(file, 'utf8', (err, data) => {
		fp.maybe(data)(console.log);
	})
);