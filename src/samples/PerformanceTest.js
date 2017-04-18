import BaseCase from './BaseCase';
import $ from 'jquery';
import {each, map, reduce} from 'utils/lambda';
import {range} from 'utils/data';
import jsondata from '../data/data.json';

const CHROME = 0
	, IE = 1
	, SAFARI = 2

	, browsers = ['Chrome', 'Internet Explorer', 'Safari']
	, picaColors = ['#1542FF', '#049E91', '#19D411']
	, downscaleColors = ['#FFAE1A', '#E0350F', '#CC16D4'];

export default class PerformanceTest extends BaseCase {
	constructor() {
		super();
	}

	start() {
		this.title = 'Editor Performance Test';

		const url = 'http://10.67.16.21:3000/data';

		// this.get(url)
		// 	.then(string => this.initData(JSON.parse(string)))
		// 	.then(dataMap => this.drawAllChart(dataMap));
		
		this.drawAllChart(
			this.initData(jsondata)
		);

		return super.start();
	}

	initData(data){

		console.log(data);

		const map = new Map();

		each(data, (d, k) => {
			if(k == 'ver') return;
			
			each(d, (v, k) => {
				if(!map.has(k)) map.set(k, new Map());
				const submap = map.get(k);

				each(v, (datum, key) => {
					if(!submap.has(key)) submap.set(key, []);
					submap.get(key).push(...this.conversion(datum));
				});
			});
		});

		// for( const [browser, d] of map ) {
		// 	for( const [version, dataArray] of d ) {
		// 		dataArray.sort((a, b) => a.size < b.size ? -1 : a.size > b.size);
		// 	}
		// }

		console.log(map);

		return map;

		// const categorized = browsers.map(
		// 		k => this.avgSize(this.processData(data, k))
		// 	);

		// this.categorized = categorized;
		// [...range(0, 3)].forEach(n => this.draw(this.categorized[n], picaColors[n], downscaleColors[n]));
	}

	conversion(dataArray){
		
		return dataArray.map(
			d => ({size: Math.sqrt(d.width * d.height) | 0, pica: d.pica, downscale: d.downscale})
		);
	}

	drawAllChart(dataMap){

		for(const [k, d] of dataMap) {

			switch(k) {
				case 'ie':
					this.eachMap(d, (dataArray, version) => this.drawChart(`ie ${version}`, dataArray));
					break;

				default: 
					this.drawChart(k, this.reduceMap(d, (a, b) => a.concat(b), []));
			}
		}
	}

	rectangularCoord(datum) {
		const pica = new Map()
			, downscale = new Map()
			, data = {};

		datum.forEach(d => {
			if(!pica.has(d.size)) pica.set(d.size, []);
			if(!downscale.has(d.size)) downscale.set(d.size, []);

			pica.get(d.size).push(d.pica);
			downscale.get(d.size).push(d.downscale);
		});

		[pica, downscale].forEach(map => {
			for(const [k, v] of map) {
				map.set(k, v.reduce((a, b) => a + b) / v.length);
			}	
		});

		data.pica = [];
		data.downscale = [];

		for(const size of pica.keys()) {
			data.pica.push({x: size, y: pica.get(size)});
			data.downscale.push({x: size, y: downscale.get(size)});
		}

		return [pica, downscale, data];
	}

	drawChart(browser, datum){
		datum.sort((a, b) => a.size < b.size ? -1 : a.size > b.size);

		const [pica, downscale, data] = this.rectangularCoord(datum);

		console.log('-----', browser, datum.length, data);

		$(this.d3stage.node()).remove();

		const padding = 5
			, sizeMin = Math.min(...pica.keys(), ...downscale.keys()) - padding * 20
			, sizeMax = Math.max(...pica.keys(), ...downscale.keys()) + padding * 20
			, timeMin = 0
			, timeMax = 2250;

		const $svg = this.d3wrapper.append('svg')
			.classed('single-chart', true)
			.attrs({
				width: 400,
				height: 300
			})

			, width = $svg.attr('width')
			, height = $svg.attr('height')
			, startX = 30
			, startY = 20;
			
		console.log('\t', sizeMin, sizeMax, timeMin, timeMax);

		const x = d3.scaleLinear()
			.range([0, width - startX - padding])
			.domain([sizeMin, sizeMax])

			, y = d3.scaleLinear()
			.range([0, height - startY - padding])
			.domain([timeMax / 1000, timeMin / 1000])

			, xinterpolate = this.interpolate(sizeMin, sizeMax, startX, width - padding)
			, yinterpolate = this.interpolate(timeMin, timeMax, height - padding - startY, padding);

		const yMat = [1, 0, 0, 1, startX, height - startY]
			, xMax = [1, 0, 0, 1, startX, padding];

		$svg.append('g')
			.attr('class', 'axis')
			.call(d3.axisBottom().scale(x).ticks(5))
			.attr('transform', `matrix(${yMat.join()})`)

		$svg.append('g')
			.attr('class', 'axis')
			.call(d3.axisLeft().scale(y).ticks(8, '.1f'))
			.attr('transform', `matrix(${xMax.join()})`)

		const line = d3.line()
			.x(d => xinterpolate(d.x))
			.y(d => yinterpolate(d.y));

		$svg.append('path')
			.attr('d', line(data.pica))
			.attr('stroke-width', 1)
			.classed('line-pica', true)
			.style('stroke', 'red');

		$svg.append('path')
			.attr('d', line(data.downscale))
			.attr('stroke-width', 1)
			.classed('line-pica', true)
			.style('stroke', 'blue');

		const $text = $svg.append('text')
			.text(`${browser} (${datum.length})`)
			.attrs({
				x: $svg.attr('width') - browser.length * 10 - 40,
				y: 23
			})
	}


	eachMap(map, iterator) {
		for( const [k, v] of map) iterator(v, k, map);
	}

	reduceMap(map, iterator, initValue) {

		let i = initValue;

		for(const [k, v] of map) {
			i = iterator(i, v, k);
		}

		return i;
	}

	draw(data, strokeA = 'blue', strokeB = 'red') {
		console.log(data);

		const width = 400
			, height = 300
			, padding = 20;

		const pica = data.pica
			, down = data.downscale
			, last = pica.length
			, margin = 100
			, [hmin, hmax] = [700000, 15000000]//[Math.min(pica[0].x, down[0].x), Math.max(pica[last - 1].x, pica[last - 1].x)]
			, [vmin, vmax] = [0, 1200]//[0, ((Math.max(pica[last - 1].y, pica[last - 1].y) + margin) / 100 | 0) * 100]
			, [ax, bx] = [padding, width]
			, [ay, by] = [height, padding]
			, xinterpolate = this.interpolate(hmin, hmax, ax, bx)
			, yinterpolate = this.interpolate(vmin, vmax, ay, by);

		const line = d3.line()
			.x(d => xinterpolate(d.x))
			.y(d => yinterpolate(d.y));

		this.d3stage.append('path')
			.attr('d', line(data.pica))
			.attr('stroke-width', 2)
			.classed('line-pica', true)
			.style('stroke', strokeA);

		this.d3stage.append('path')
			.attr('d', line(data.downscale))
			.attr('stroke-width', 2)
			.classed('line-pica', true)
			.style('stroke', strokeB);
	}

	interpolate(min, max, a, b) {
		return n => (b - a) * (n - min) / (max - min) + a | 0;
	}


	processData(data, key) {
		const a = [];

		each(data, (d, k) => {
			if(k === 'ver' || !d[key]) return;

			a.push(...d[key]);
		});

		const _a = a.map(d => ({size: d.width * d.height, pica: d.pica, downscale: d.downscale}));
		_a.sort((a, b) => a.size < b.size ? -1 : a.size > b.size);

		return _a;
	}

	avgSize(data) {
		const t = {};

		data.forEach(d => {
			const pica = t['p_' + d.size] = t['p_' + d.size] || []
				, down = t['d_' + d.size] = t['d_' + d.size] || [];

			pica.push(d.pica);
			down.push(d.downscale);
		})

		const result = {pica: [], downscale: []}
			, avg = map(t, d => d.reduce((a, b) => a + b) / d.length);

		each(avg, (d, k) => {
			const target = k.indexOf('p_') != -1 ? result.pica : result.downscale;

			target.push({x: Number(k.match(/[0-9]{1,}/g)[0]), y: d});
		});

		return result;
	}

	get(url){
		return new Promise((resolve, reject) => {
			$.get(
				url,
				'',
				(response, status, xhr) => resolve(response) 
			);
		});
	}
}