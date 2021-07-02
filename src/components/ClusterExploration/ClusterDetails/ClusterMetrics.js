/* eslint-disable react/prop-types */
import React from 'react';
// import '../../styles/ClusterExploration/cluster-details-metrics.css';
import '../../../styles/ClusterExploration/cluster-details-metrics.css';

export default function ClusterMetrics(props) {

  const testClusterMetrics = {
    'Number of Points': '33',
    'Cluster Center': '0.39, 0.53',
    'Cluster Movement': 'High',
    'Variance': '0.92',
    'Heteroskedasticity': '0.16',
    'Silhouette Score': '0.52'
  };

  const renderClusterMetrics = () => {
    let content = [];
    for (const [key, value] of Object.entries(testClusterMetrics)) {
      content.push(
        <div className="cluster-details-metric-wrapper" key={key}>
          <p className="cluster-detail-metric">{key}</p>
          <p className="cluster-detail-value">
            {value}
          </p>
        </div>
      );
    }
    return content;
  };

  return (
    <div className='cluster-details-metrics-container'>
      <h3 className='cluster-details-metrics-header'>Cluster Metrics</h3>
      {
        renderClusterMetrics()
      }
      {/* {testClusterMetrics ? (
        Object.keys(testClusterMetrics[0]).map((score, index) => {
          return (
            <div className="model-details-metric-wrapper" key={index}>
              <p className="model-detail-metric">{score}</p>
              <p className="model-detail-value">
                {testClusterMetrics[0][score]}
              </p>
            </div>
          );
        })
      ) : (
        <p>no model metrics</p>
      )} */}
    </div>
  );
}