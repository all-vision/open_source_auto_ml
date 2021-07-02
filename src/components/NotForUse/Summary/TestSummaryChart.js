/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import D3Chart from './D3Chart';

export default class ChartWrapper extends Component {
  componentDidMount() {
    this.setState({
      chart: new D3Chart(this.refs.chart),
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps() {
    this.state.chart.update();
  }
  render() {
    return <div ref="chart" style={{ border: '1px solid blue' }}></div>;
  }
}
