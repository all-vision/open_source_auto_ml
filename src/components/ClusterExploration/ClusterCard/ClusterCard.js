/* eslint-disable react/prop-types */
import React from 'react';
import ClusterScatterplot from './ClusterScatterplot';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

export default function ClusterCard(props) {
  return (
    <div className="cluster-card-wrapper">
      <ClusterScatterplot
        chartData={props.cluster}
        columnHeaders={props.columnHeaders}
        showToolTip={false}
      />
      <div className="cluster-card-header">
        <h1>{props.cluster.name}</h1>

        <div
          className="cluster-card-checkbox"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <h4 style={{ fontWeight: '400' }}>Select to Compare</h4>
          <Tooltip title="Select Cluster for Comparison">
            <Checkbox
              checked={props.cluster.checked}
              onChange={() =>
                props.handleSelectClusterForComparison(props.cluster.name)
              }
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Tooltip>
        </div>
      </div>
      <div
        className="cluster-card-content"
        onClick={() => props.handleSelectActiveCluster(props.cluster.name)}
      >
        <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Number of Points</p>
          <p className="cluster-card-value">{props.cluster.data.length}</p>
        </div>
        {/* <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Cluster Center</p>
          <p className="cluster-card-value">
            {Math.random().toString().slice(0, 4)},{' '}
            {Math.random().toString().slice(0, 4)}
          </p>
        </div> */}
        {/* <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Cluster Movement</p>
          <p className="cluster-card-value">
            {(() => {
              if (props.index === 0 || props.index === 1) {
                return 'High';
              } else {
                return 'Low';
              }
            })()}
          </p>{' '}
        </div> */}
        {/* <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Variance</p>
          <p className="cluster-card-value">
            {Math.random().toString().slice(0, 4)}
          </p>{' '}
        </div> */}
        {/* <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Heteroskedasticity</p>
          <p className="cluster-card-value">
            {Math.random().toString().slice(0, 4)}
          </p>{' '}
        </div> */}
        {/* <div className="cluster-card-content-wrapper">
          <p className="cluster-card-key">Silhouette Score</p>
          <p className="cluster-card-value">
            {Math.random().toString().slice(0, 4)}
          </p>{' '}
        </div> */}
      </div>
    </div>
  );
}
