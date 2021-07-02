/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import '../../../styles/Settings/BillingAndUsage/usage.css';

const mapStateToProps = (state) => {
  return {
    totalDataUsage: state.totalDataUsage,
  };
};
function Usage(props) {

  const convertFileSize = (a) => {
    let b = 0,
      c = parseInt(a, 10) || 0;
    for (; 1024 <= c && ++b; ) c /= 1024;
    return (
      c.toFixed(10 > c && 0 < b ? 1 : 0) +
      ' ' +
      ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][b]
    );
  };

  return (
    <div className="current-plan-wrapper">
      <div className="current-usage-header">
        <h1 className="settings-user-information-wrapper-title">
          Current Usage
        </h1>
        <p className="current-usage-data">
          Current Data Usage: {convertFileSize(props.totalDataUsage)}{' '}
          <b>
            ({Math.round((props.totalDataUsage / 50000000) * 100)}% of 50MB
            Limit)
          </b>
        </p>
      </div>

      <div className="current-usage-wrapper">
        <progress
          value={props.totalDataUsage}
          className="current-usage-progress-bar"
          max="50000000"
        ></progress>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Usage);

// export default Usage;
