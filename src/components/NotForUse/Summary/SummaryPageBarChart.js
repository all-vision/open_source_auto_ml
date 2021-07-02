/* eslint-disable react/prop-types */
import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

export default class D3Chart2 extends React.Component {
  data = {
    columns: [[...this.props.data]],
    type: 'bar',
  };
  legend = {
    show: false,
  };
  bar = {
    width: {
      ratio: 0.75, // this makes bar width 50% of length between ticks
    },
  };
  size = {
    width: screenWidth < 1900 ? 290 : 300,
    height: 200,
  };
  color = {
    pattern: ['#1E88E5'],
  };
  axis = {
    x: {
      show: false,
    },
    y: {
      show: false,
    },
  };

  render() {
    return (
      <C3Chart
        className="bar-chart"
        data={this.data}
        bar={this.bar}
        size={this.size}
        color={this.color}
        axis={this.axis}
        legend={this.legend}
      />
    );
  }
}
