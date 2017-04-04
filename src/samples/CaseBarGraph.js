import BaseCase from 'samples/BaseCase';
import {random, randomIter} from 'utils/data';
import {colorMixHex} from 'utils/color';
import {zfill} from 'utils/string';

const COLOR_MIN = 0xdda8ff;
const COLOR_MAX = 0x1f54ff;

export default class CaseBarGraph extends BaseCase {

	constructor() {
		super();

		this.numDatas = 50;
		this.delay = 10;
		this.duration = 200;
		this.stageWidth = 400;
	}

	start() {
		this.title = 'Simple Bar Graph';

		this.d3wrapper.insert( 'button', 'svg' )
			.on( 'click', this.onClick.bind(this) )
			.text( 'reload-data');

		this.d3stage.append('g')
			.attr('transform', `translate(${this.margin},${this.margin})`)
			.selectAll('rect')
			.data(random(this.numDatas, 50, this.stageWidth))
			.enter()
			.append('rect')
			.on('mouseover', this.onMouseOver.bind(this))
			.on('mouseout', this.onMouseOut.bind(this))
			.attr('x', 0)
			.attr('y', (d, i) => i * (this.graphHeight + this.gap))
			.attr('width', 0)
			.attr('height', this.graphHeight)
			.transition()
			.delay( (d, i) => i * this.delay )
			.duration( this.duration )
			.attr('width', d => d | 0)
			.attr('fill', d => this.getMixedColor(d / this.stageWidth) );

		this.setAxis();

		return super.start();
	}

	setAxis(){

		const width = this.get('width')
		
			, scaleLinear = d3.scaleLinear()
				.domain([0, width])
				.range([0, width]);	

		this.d3stage.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(${this.margin}, ${this.numDatas * (this.graphHeight + this.gap) + this.gap * 2})`)
			.call(d3.axisBottom()
				.scale(scaleLinear)
			)

	}

	onClick(){

		this.d3stage
			.selectAll('rect')
			.data(random(this.numDatas, 50, this.stageWidth))
			.transition()
			// .delay((d, i) => i * this.delay)
			.duration( this.duration )
			.attr('width', d => d | 0)
			.attr('fill', d => this.getMixedColor(d / this.stageWidth) );
	}

	getMixedColor(t, a = COLOR_MIN, b = COLOR_MAX,) {
		return `#${zfill(colorMixHex(a, b, t).toString(16), 6)}`;
	}

	onMouseOver() {
		const d3target = d3.select(d3.event.target)
			, hex = colorMixHex(COLOR_MIN, COLOR_MAX, d3target.datum() / this.stageWidth)
			, [r, g, b] = [16, 8, 0].map( n => Math.min(255, (hex >> n & 0xff) + 50));

		d3target.attr('fill', `#${zfill((r << 16 | g << 8 | b).toString(16), 6)}`);
	}

	onMouseOut() {
		const d3target = d3.select(d3.event.target);

		d3target.attr('fill', d => this.getMixedColor(Math.min(1.0, d / this.stageWidth)));
	}

	get margin(){
		return 2;
	}

	get gap() {
		return 1;
	}

	get graphHeight(){
		return 4;
	}
}