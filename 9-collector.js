'use strict';

function Collector() { }

const collect = expected => {
	const collector = (key, value) => {
		if (collector.finished) return collector;
		collector.count++;
		if (value instanceof Error) {
			collector.callback(value, collector.data);
			collector.finished = true;
			return collector;
		}
		collector.data[key] = value;
		if (collector.expected === collector.count) {
			collector.callback(null, collector.data);
			collector.finished = true;
		}
		return collector;
	};

	const fields = {
		count: 0,
		expected,
		data: {},
		callback: null,
		finished: false,
	};

	Object.setPrototypeOf(collector, Collector.prototype);
	return Object.assign(collector, fields);
};

Collector.prototype.done = function (callback) {
	this.callback = callback;
	return this;
};

// Usage

const dc = collect(4).done((err, data) => {
	console.log('Done callback');
	console.dir({ err: err ? err.message : null, data });
});

dc('key1', 'value1');
console.log(dc);

setTimeout(() => {
	dc('key2', 'value2');
}, 100);

setImmediate(() => {
	dc('key3', 'value3');
	console.log(dc);
});

dc('key4', 'value4');
// dc('key5', 'value5');
dc('key5', new Error('Error value'));