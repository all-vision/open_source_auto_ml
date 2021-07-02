/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import color_palette from '../Shared/ColorPalette';
import { formatDataForScatterplot } from '../../utils';
import '../../styles/DEB/deb-chart-and-metrics-wrapper.css';


export default class ChartAndMatricsWrapper extends React.Component {

  state = {
    filteredData: [],
    data: [],
    options: null,
    targetRow: null,
  }

  componentDidMount() {
    let existingData = this.props.data;
    let DATA = formatDataForScatterplot(existingData);

    this.setState({
      data: DATA,
    });

  }

  componentDidUpdate(previousProps) {
    if (this.props.data !== previousProps.data) {
      let existingData = this.props.data;
      let DATA = formatDataForScatterplot(existingData);
      this.setState({
        data: DATA
      });
    }
  }
  
  render() {
    return (
      <div className="model-details-chart-and-metrics-wrapper">
        <div className="model-details-chart-wrapper">
        </div>
        <div className="emerging-behaviors-data-wrapper">
          <div className="deb-model-details-metrics-wrapper">
            <div className="deb-model-details-metrics-header">
              <h3>Emerging Behaviors</h3>
            </div>
            <div className="emerging-behavior-wrapper" >
              <div className="emerging-behavior-color" style={{ background: '#28EE90' }} />
              <div className="emerging-behavior-details">
                <h3>Emerging Behavior Detected</h3>
                <p>318 points in cluster seven</p>
              </div>
              <div className="emerging-behavior-detected-date">
                <p>
                  1w
                </p>
              </div>
            </div>
          </div>
          <div className="your-data-wrapper">
            <div className="your-data-header">
              <h3>Your Data</h3>
            </div>
            <div className="your-data-content">
              <p className="your-data-key">Data Processing</p>
              <p className="your-data-value">Streaming</p>
            </div>
            <div className="your-data-content">
              <p className="your-data-key">Today</p>
              <p className="your-data-value">+ 50M Rows</p>
            </div>
            <div className="your-data-content">
              <p className="your-data-key">This Week</p>
              <p className="your-data-value">+ 225M Rows</p>
            </div>
            <div className="your-data-content">
              <p className="your-data-key">Total</p>
              <p className="your-data-value total">12B Rows</p>
            </div>
            {/* <TimeSelect handleTimeSelectChange={props.handleTimeSelectChange} timeSelectValue={props.timeSelectValue}></TimeSelect> */}
          </div>
        </div>
      </div>
  
    );
  }
  
}
