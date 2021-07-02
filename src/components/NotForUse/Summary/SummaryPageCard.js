/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import SummaryPageBarChart from './SummaryPageBarChart';
import '../../styles/SummaryPage/summary-page-card-metrics.css';
import '../../styles/SummaryPage/summary-page-card.css';

export default class SummaryPageCard extends Component {
  render() {
    return (
      <div className="summary-page-card">
        <div className="summary-page-card-header">
          <h3>{this.props.column.columnName}</h3>
          <div className="summary-page-card-type">
            {this.props.column.type === 'character' ? (
              <TextFormatIcon fontSize={'default'}></TextFormatIcon>
            ) : (
              '#'
            )}
          </div>
        </div>
        <div className="summary-page-card-chart-wrapper">
          <SummaryPageBarChart
            data={this.props.column.data}
          ></SummaryPageBarChart>
        </div>

        <div className="summary-page-card-metrics-wrapper">
          <div className="percentage-bar-wrapper">
            <div className="percent-valid"></div>
            <div className="percent-invalid"></div>
          </div>
          <div className="summary-page-card-metrics">
            <p className="metric">Valid</p>
            <p className="metric-number">
              76 <span>(71%)</span>
            </p>
          </div>
          <div className="summary-page-card-metrics">
            <p className="metric">Missing</p>
            <p className="metric-number">
              76 <span>(71%)</span>
            </p>
          </div>
          <div className="summary-page-card-metrics">
            <p className="metric">Min</p>
            <p className="metric-number">
              76 <span>(71%)</span>
            </p>
          </div>
          <div className="summary-page-card-metrics">
            <p className="metric">Mean</p>
            <p className="metric-number">
              76 <span>(71%)</span>
            </p>
          </div>
          <div className="summary-page-card-metrics">
            <p className="metric">Standard Deviation</p>
            <p className="metric-number">
              76 <span>(71%)</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
