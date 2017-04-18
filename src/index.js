
import {ready, loadImage} from 'utils/async';
import CaseBarGraph from 'samples/CaseBarGraph';
import SVGBasic from 'samples/SVGBasic';
import SVGStyles from 'samples/SVGStyles';
import D3DataSample from 'samples/D3DataSample';
import PerformanceTest from 'samples/PerformanceTest';

const cases = [
	PerformanceTest,
	// D3DataSample,
	// SVGStyles,
	// SVGBasic,
	// CaseBarGraph,
];

ready( window ).then( delegate );

function delegate( target ) {

	console.log( 'ready' );

	const promises = cases.map( f => new f().start() );

	Promise.all( promises ).then( appendAll );
}


function appendAll( doms ) {
	const div = document.getElementById( 'wrapper' );

	doms.forEach( dom => div.appendChild( dom ) );
}


// const dataset = [
// 	300, 130, 180, 60, 240, 33, 67, 400, 234, 456
// ];

// window.onload = init;

// function init(){

// 	d3.select( '.container-center' )
// 		.insert( 'div', ':first-child' )
// 		.classed( 'header', true )
// 		.text( '막대형 그래프' );

// 	d3.select( '.container-center' )
// 		.append( 'button' )
// 		.text( 'data update' )
// 		.on( 'click', e => reloadData( randomData() ) );

// 	const d3Stage = d3.select( '#stage' );

// 	d3Stage.attr( 'width', 800 )
// 		.attr( 'height', 600 );

// 	// dataset.forEach( (n, i) =>
// 	// 	d3.select( "#stage" )
// 	// 		.append( 'rect' )
// 	// 		.attr( 'x', 0 )
// 	// 		.attr( 'y', i * 20 )
// 	// 		.attr( 'width', n )
// 	// 		.attr( 'height', 18 )
// 	// 		.attr( 'fill', '#C00' )
// 	// );

// 	//console.log( d3.select( document.getElementById( 'stage' ) ).attr( 'width', 500) );	


// 	d3Stage.selectAll( 'rect' )
// 		.data( dataset )
// 		.enter()
// 		.append( 'rect' )
// 		.on( 'mouseover', onMouseOver )
// 		.on( 'mouseout', onMouseOut ) 
// 		.attr( 'x', 		1 )
// 		.attr( 'y', 		(_, i) => 1 + i * 20)
// 		.attr( 'width', 	0 )
// 		.attr( 'height', 	18 )
// 		.attr( 'fill', 		d => `rgb(0,0,${d / 600 * 255 | 0})` )
// 		.transition()
// 		.delay( (_, i) => 80 * i )
// 		.duration( 800 )
// 		.attr( 'width', d => d );

// 	d3.csv( 'data/tempdata.csv', (err, data) => {

// 		const set = data.map( o => Number( o.item1 ) );

// 		console.log(set);

// 		return;

// 		d3.select( '#stage' )
// 			.selectAll( 'rect' )
// 			.data( set )
// 			.enter()
// 			.attr( 'width', d => d );
// 	})
// }




// function onMouseOver() {

// 	console.log( d3.select( d3.event.target ).datum() );
 	
//  	d3.select( d3.event.target )
//  		.attr( 'fill', d => `rgb(50,50,${d / 600 * 255 | 0})` );
// }

// function onMouseOut() {

// 	d3.select( d3.event.target )
// 		.attr( 'fill', d => `rgb(0,0,${d / 600 * 255 | 0})` );
// }

// function randomData() {
// 	return dataset.map( n => 2 * n * Math.random() );
// }

// function reloadData( set ) {

// 	d3.select( '#stage' )
// 		.selectAll( 'rect' )
// 		.data( set )
// 		.transition()
// 		.attr( 'width', d => d )
// 		.attr( 'fill', d => `rgb(0,0,${d / 600 * 255 | 0})` );
// }

// function toHex( n ) {

// 	return zfill( Math.min( 255, n | 0 ).toString(16), 2, '0' );;
// }

// function zfill( s, n = 2, prefix = '0' ) {

// 	if( s.length >= n ) return s;

// 	return zfill( prefix + s, n, prefix );
// }

