export {zfill};

function zfill( s, len, prefix = '0' ) {
	if( s.length >= len ) return s;

	return zfill( prefix + s, len, prefix );
}