import React from 'react';
import ScatterPlot from './ScatterPlot';
import ScatterplotChart from './ScatterplotChart';
import MetricsWrapper from './MetricsWrapper';
import '../../../styles/SummaryPage/cluster-chart-wrapper/cluster-chart-wrapper.css';

export default class ClusterChartWrapper extends React.Component {
  render() {
    return (
      <div className="summary-page-cluster-chart-wrapper">
        <div className="summary-page-cluster-chart">
          <ScatterplotChart></ScatterplotChart>
          {/* <ScatterPlot columns={this.props.columns}></ScatterPlot> */}
        </div>
        <div className="scatterplot-metrics-wrapper">
          <MetricsWrapper></MetricsWrapper>
        </div>
      </div>
    );
  }
}
