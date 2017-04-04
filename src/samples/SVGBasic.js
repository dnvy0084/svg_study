import BaseCase from './BaseCase';

export default class SVGBasic extends BaseCase {
	constructor() {
		super();
	}

	start() {

		this.title = 'SVGBasic';

		this.d3stage.append('rect')
			.attr('x', 10)
			.attr('y', 20)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('width', 80)
			.attr('height', 60)
			.classed('orange-rect', true);

		this.d3stage.append('circle')
			.attr('cx', 80)
			.attr('cy', 40)
			.attr('r', 30)
			.classed('blue-circle', true);

		this.d3stage.append('path')
			.attr('d', 'M150,100 l60,0 l-60,-60 l-60,60 l60,0')
			.classed('red-line-triangle', true);

		this.d3stage.append('path')
			.attr('d', 'M200,140 c20,-100 80,-20 100,0')
			.attr('class', 'bazier');

		this.d3stage.append('text')
			.attr('x', 100)
			.attr('y', 200)
			.text(this.title)
			.attr('class', 'basic-text');

		// this.d3stage.append('circle')
		// 	.attr({
		// 		cx: 300,
		// 		cy: 200,
		// 		r: 50
		// 	});

		const g = this.d3stage.append('g');
			
		g.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.text('group sample');

		g.append('rect')
			.attr('x', 0)
			.attr('y', 10)
			.attr('width', 100)
			.attr('height', 100)
			.attr('fill', 'red')
			.attr('opacity', 0.5);

		let mat = [1, 0, 0, 1, 100, 120];

		g.attr('transform', `matrix(${mat.join()})`);

		let t = 0;

		const tick = (ms) => {
			const cos = Math.cos(ms/5000)
				, sin = Math.sin(ms/5000);

			mat = [cos, sin, -sin, cos, 100, 120];

			this.d3stage.select('g')
				.attr('transform', `matrix(${mat.join()})`);

			requestAnimationFrame( tick );

			t += 0.005;
		}

		// tick(0);

		return super.start();
	}
}