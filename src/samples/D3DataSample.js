import BaseCase from './BaseCase';
import {random} from 'utils/data';

export default class D3DataSample extends BaseCase {
	constructor() {
		super();
	}

	start() {
		this.title = 'Data Sample';

		this.d3wrapper.insert('button', 'svg')
			.on('click', this.onClick.bind(this))
			.text('reload');
 
		const data = random(60, 10, this.d3stage.attr('height') - 10 )
			, margin = 2
			, width = 5
			, gap = 1
			, y = this.d3stage.attr('height') - margin;

		this.d3stage.append('g')
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attrs({
				x: (d, i) => margin + (width + gap) * i,
				y: y,
				width: width,
				height: 1,
				class: 'bar',
				fill: (d, i) => '#ff0000'
			})
			.transition()
			.delay((d, i) => i * 30)
			.duration(500)
			.attrs({
				y: (d, i) => y - d,
				height: (d, i) => d
			});

		return super.start();
	}

	onClick(){
		this.d3stage.selectAll('.bar')
			.data(random(60, 10, this.d3stage.attr('height') - 10))
			.transition()
			.delay((d, i) => i * 30)
			.duration(500)
			.attrs({
				y: (d, i) => this.d3stage.attr('height') - 2 - d,
				height: (d, i) => d
			});
	}

}// class