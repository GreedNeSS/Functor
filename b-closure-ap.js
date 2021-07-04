'use strict';

const maybe = x => {
	const map = fn => maybe(x ? fn(x) : null);
	const ap = functor => functor.map(f => x && f ? f(x) : null);
	const chain = f => f(x);
	return Object.assign(map, { map, ap, chain });
};

// Usage

const twice = x => x * 2;
const inc = x => ++x;

maybe(5)(twice)(inc)(console.log);
maybe(5).map(twice).map(inc).map(console.log);
maybe(5)(twice).ap(maybe(inc))(console.log);
maybe(5)(twice).ap(maybe())(console.log);
maybe(5).chain(x => maybe(x * 2))(inc)(console.log);
maybe(5).chain(x => maybe(x * 2)).map(inc)(console.log);
maybe(5).ap(maybe(5)(x => y => x + y))(inc)(console.log);

const config = {
	coords: {
		x: 0,
		y: 5,
	},
	velocity: {
		x: 1,
		y: 1,
	},
};

const addVelocity = velocity => coords => {
	coords.x += velocity.x;
	coords.y += velocity.y;
	return coords;
};

const coords = maybe(config.coords);
const velocity = maybe(config.velocity);
coords.ap(velocity(addVelocity)).map(console.log);