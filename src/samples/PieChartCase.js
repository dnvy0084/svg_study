import BaseCase from './BaseCase';
import {map, reduce} from 'utils/lambda';

export default class PieChartCase extends BaseCase {
	constructor() {
		super();
	}

	start() {
		this.title = 'Pie Chart Samples';

		const data = this.getPieChartDummyData(10)
			, total = reduce(data, (a, b) => a + b);

		const pie = d3.pie();

		const pieElements = this.d3stage.selectAll('path')
			.data(pie(data))
			, arc = d3.arc().innerRadius(20).outerRadius(100);

		const mat = [
			1, 0, 0, 1, 
			this.d3stage.attr('width') / 2,
			this.d3stage.attr('height') / 2,
		]

		pieElements.enter()
			.append('path')
			.attrs({
				class: 'pie',
				transform: `matrix(${mat.join()})`
			})
			// .style('fill', (d, i) => `rgb(${(i + 1) / data.length * 255 | 0},0,0)`);
			.style('fill', (d, i) => d3.schemeCategory10[i])
			.transition()
			.duration(1000)
			.delay((d, i) => i * 1000)
			// .ease('linear')
			.attrTween('d', (d, i) => {
				const interp = d3.interpolate(
					{startAngle: d.startAngle, endAngle: d.startAngle},
					{startAngle: d.startAngle, endAngle: d.endAngle}
				);

				return function(t) {
					return arc(interp(t));
				}
			})

		return super.start();
	}

	getPieChartDummyData(len = 5) {
		const a = map(len - 1, n => 0.5 * 1 / (n + 1) * Math.random());

		return a.concat(1 - reduce(a, (a, b) => a + b));
	}
}