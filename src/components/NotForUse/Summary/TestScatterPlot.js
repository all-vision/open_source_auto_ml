import { scaleLinear, select, axisLeft, axisBottom } from 'd3';
const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const DATA = [
  {
    question: 'Activity One',
    answer: 'Some answer',
    value: 5,
    consequence: 1,
  },
  {
    question: 'Activity Two',
    answer: 'Some answer',
    value: 4,
    consequence: 1,
  },
  {
    question: 'Activity Three',
    answer: 'Another answer',
    value: 4,
    consequence: 2,
  },
  {
    question: 'Activity Four',
    answer: 'Another answer',
    value: 5,
    consequence: 4,
  },
  {
    question: 'Activity Five',
    answer: 'Another answer',
    value: 4,
    consequence: 5,
  },
  {
    question: 'Activity Six',
    answer: 'Another answer',
    value: 1,
    consequence: 1,
  },
  {
    question: 'Activity Seven',
    answer: 'Another answer',
    value: 1,
    consequence: 5,
  },
];

class TestScatterPlot {
  constructor() {
    var svg = select('#scatter'),
      margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = +svg.attr('width'),
      height = +svg.attr('height'),
      domainwidth = width - margin.left - margin.right,
      domainheight = height - margin.top - margin.bottom;

    var x = scaleLinear()
      .domain(padExtent([1, 5]))
      .range(padExtent([0, domainwidth]));
    var y = scaleLinear()
      .domain(padExtent([1, 5]))
      .range(padExtent([domainheight, 0]));

    var g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    g.append('rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');

    DATA.forEach(function (d) {
      d.consequence = +d.consequence;
      d.value = +d.value;
    });

    g.selectAll('circle')
      .data(DATA)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 7)
      .attr('cx', function (d) {
        return x(d.consequence);
      })
      .attr('cy', function (d) {
        return y(d.value);
      })
      .style('fill', function (d) {
        if (d.value >= 3 && d.consequence <= 3) {
          return '#60B19C';
        } // Top Left
        else if (d.value >= 3 && d.consequence >= 3) {
          return '#8EC9DC';
        } // Top Right
        else if (d.value <= 3 && d.consequence >= 3) {
          return '#D06B47';
        } // Bottom Left
        else {
          return '#A72D73';
        } //Bottom Right
      });

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + y.range()[0] / 2 + ')')
      .call(axisBottom(x).ticks(5));

    g.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + x.range()[1] / 2 + ', 0)')
      .call(axisLeft(y).ticks(5));

    function padExtent(e, p) {
      if (p === undefined) p = 1;
      return [e[0] - p, e[1] + p];
    }
  }
}

export default TestScatterPlot;
