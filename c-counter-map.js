'use strict';

function Counter() { }

const counter = initial => {
	const f = val => {
		f.count += val;
		f.events.forEach((callbacks, n, map) => {
			if (n <= f.count) {
				callbacks.forEach(callback => callback(f.count));
				map.delete(n);
			}
		});
		return f;
	};
	Object.setPrototypeOf(f, Counter.prototype);
	return Object.assign(f, { count: 0, events: new Map() })(initial);
};

Counter.prototype.on = function (n, callback) {
	const arrCallback = this.events.get(n);
	if (arrCallback) {
		arrCallback.push(callback);
	} else {
		this.events.set(n, [callback]);
	}
	return this(0);
};

// Usage

const c = counter(6);
c.on(7, val => console.log('Counter > 7, value:', val));
c.on(7, val => console.log('Second callback:', val));
c.on(25, val => console.log('Counter > 25, value:', val));
console.log(c.count, c.events);
c(5);
console.log(c.count, c.events);
setTimeout(() => {
	c(15);
	console.log(c.count, c.events);
}, 1000);