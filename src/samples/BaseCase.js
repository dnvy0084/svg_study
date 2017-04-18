
export default class BaseCase {

	constructor( width = 550, height = 400 ) {
		this._init( width, height );
	}

	_init( width, height ) {

		this.d3wrapper = d3.select( document.createElement( 'div' ) ).classed('case-container', true);
		this.d3header = d3.select( document.createElement( 'p' ) );
		this.d3stage = this.d3wrapper.append( 'svg' )
			.attr( 'width', width )
			.attr( 'height', height )
			.attr( 'viewBox', `0 0 ${width} ${height}` );

		[ this.d3header, this.d3stage ].forEach( d3dom => this.d3wrapper.node().appendChild( d3dom.node() ) );

		this.title = 'BaseCase';
	}

	get(key, from = this.d3stage) {
		return from.attr(key);
	}

	start() {
		return Promise.resolve( this.dom );
	}


	get dom() {
		return this.d3wrapper.node();
	}


	get title() {
		return this.d3header.text();
	}
	
	set title(value) {
		this.d3header.text( value );
	}
}