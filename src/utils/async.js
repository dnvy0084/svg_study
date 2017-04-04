
export {ready, loadImage};

/**
 * onload, onerror callback이 호출되는 target의 promise wrapping
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
function ready( target ) {

	if( target.complete ) Promise.resolve( target );

	return new Promise( (resolve, reject) => {

		target.onload = () => resolve(target);
		target.onerror = e => reject(e);
	});
}

/**
 * Image Element를 사용해 url의 image를 불러온다. 
 * @param  {[type]} url         [description]
 * @param  {[type]} imgElement  [description]
 * @param  {[type]} crossOrigin [description]
 * @return {[type]}             [description]
 */
function loadImage( url, imgElement = document.createElement('img'), crossOrigin = null ) {

	imgElement.src = url;

	if( crossOrigin ) 
		imgElement.crossOrigin = crossOrigin;

	return ready( imgElement );
}