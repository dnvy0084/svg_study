import {range} from 'utils/data';
import BaseCase from './BaseCase';

import {selection, select} from 'd3-selection';
import 'd3-selection-multi';

console.log(selection, select);

export default class SVGStyles extends BaseCase {

	constructor() {
		super();
	}

	start() {
		this.title = 'SVG Styles';

		for(let n of range(0,5)) {
			this.d3stage.append('rect')
				.attr('class', 'bar');
		}

		this.d3stage.selectAll('.bar')
			.attrs({
				x: 10, 
				y: (d, i) => 10 + i * 20,
				width: (d, i) => 100 + i * 50,
				height: 18,
				fill: (d, i) => `rgb(${i * 50}, 10, 100)`
			});

		this.d3stage.selectAll('.bar')
			.call( select => console.log(select) );

		return super.start();
	}
}