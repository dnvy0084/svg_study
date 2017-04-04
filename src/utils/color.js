export {colorMixHex, mix};

function colorMixHex( min, max, t ) {

	const r = mix( (min >> 16 & 0xff), (max >> 16 & 0xff), t ) | 0
		, g = mix( (min >> 8 & 0xff), (max >> 8 & 0xff), t ) | 0
		, b = mix( min & 0xff, max & 0xff, t ) | 0;

	return r << 16 | g << 8 | b;
}

function mix( a, b, t ) {
	return a + t * (b - a);
}