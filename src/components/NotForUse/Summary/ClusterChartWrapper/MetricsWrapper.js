import React, { Component } from 'react';
import '../../../styles/SummaryPage/cluster-chart-wrapper/model-metrics-wrapper.css';

export default class MetricsWrapper extends Component {
  render() {
    return (
      <div className="metrics-wrapper">
        <div className="metrics-header">
          <h1>Model Metrics</h1>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Model Name:</p>
          <p className="metric-value">DB Scan</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Model Description:</p>
          <p className="metric-value">Density</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Silouette Score:</p>
          <p className="metric-value">.83</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Number of Clusters: :</p>
          <p className="metric-value">7</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Adjusted Rand Index:</p>
          <p className="metric-value">1</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">Anomolies:</p>
          <p className="metric-value">4</p>
        </div>
        <div className="metric-wrapper">
          <p className="metric-name">New Anomolies:</p>
          <p className="metric-value">2</p>
        </div>
      </div>
    );
  }
}
