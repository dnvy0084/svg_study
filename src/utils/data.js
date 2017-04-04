
export {random, randomIter, range};

function random( len, min = 0, max = 100 ) {
	const a = [];

	for( ; len--; ) a.push( (max - min) * Math.random() + min );

	return a;
}

function* randomIter( len, min = 0, max = 100 ) {
	for( ; len--; ) yield (max - min) * Math.random() + min;
}

function* range(a, b, n = 1) {
	for( ; a < b; a += n ) yield a;
}