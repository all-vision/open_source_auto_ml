import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Scatterplot from '../Shared/Scatterplot';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import cloneDeep from 'lodash/cloneDeep';
import '../../styles/ModelDetails/chart-and-metrics-wrapper.css';

/*
* wrapper component for the scatterplot, model metrics card, and filter by cluster size card
*/
export default function ChartAndMetricsWrapper(props) {

  return (
    <div className="model-details-chart-and-metrics-wrapper">
      <div className="model-details-chart-wrapper">
        {props.chartData.length > 0 ? (
          <Scatterplot
            chartData={props.chartData}
            isFiltering={props.isFiltering}
            selectedClusters={props.selectedClusters}
            enableScatterplotTooltip={props.enableScatterplotTooltip}
            filterLoadingText={props.filterLoadingText}
            columnHeaders={props.columnHeaders}
            chartClusters={props.chartClusters}
            handleScatterplotPointClicked={props.handleScatterplotPointClicked}
          ></Scatterplot>
        ) : (
          <>
            <h3>Loading Clusters</h3>
            <Skeleton
              animation="wave"
              variant="rect"
              width={900}
              height={250}
            />
            <div className="model-detail-skeleton-container">
              <div className="model-detail-skeleton">
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width={450}
                  height={250}
                />
              </div>
              <div className="model-detail-skeleton">
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width={450}
                  height={250}
                />
              </div>  

            </div>
          </>
        )}
      </div>
      <div className="model-details-right-side">
        <div className="model-details-metrics-wrapper">
          <div className="model-details-metrics-header">
            <h3>Model Metrics</h3>
          </div>
          {props.model.ModelScores ? (
            Object.keys(props.model.ModelScores[0]).map((score, index) => {
              return (
                <div className="model-details-metric-wrapper" key={index}>
                  <p className="model-detail-metric">{score}</p>
                  <p className="model-detail-value">
                    {props.model.ModelScores[0][score]}
                  </p>
                </div>
              );
            })
          ) : (
            <p>no model metrics</p>
          )}
        </div>
        <div className="cluster-filtering-wrapper">
          <div className="model-details-metrics-header">
            <h3>Cluster Information</h3>
          </div>
          <div className="model-details-metric-wrapper">
            <p className="model-detail-metric ">
              Cluster Name
            </p>
            <p className="model-detail-value sort-by-cluster-size">
                Points in cluster
            </p>
          </div>
          <div className="scrolling-clusters-wrapper">
            {props.chartData
              ? props.chartData.sort((a, b) => b.data.length - a.data.length).map((data, index) => {
                if (data.data.length > 0) {
                  return (
                    <div key={index} className="model-details-metric-wrapper">
                      <div
                        className="model-detail-metric flex-row"
                      >
                        <div
                          style={{

                            background: data.color.replace(
                              /[^,]+(?=\))/,
                              '1'
                            ),
                            
                          }}
                          className="cluster-circle"
                        ></div>
                        <p className='cluster-name'>{data.name}</p>
                      </div>
                      <p className="model-detail-value">{data.data.length}</p>
                    </div>
                  );
                }
              })
              : null}
          </div>
          <div className="filter-by-cluster-size-wrapper">
            <Button
              size="small"
              className="filter-by-cluster-size-button"
              onClick={props.handleOpenFilterByClusterSizeModal}
            >
              Filter chart by cluster size
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

ChartAndMetricsWrapper.propTypes = {
  model: PropTypes.object,
  data: PropTypes.array,
  options: PropTypes.object,
  chartData: PropTypes.array,
  handleScatterplotPointClicked: PropTypes.func,
  chartClusters: PropTypes.array,
  handleOpenFilterByClusterSizeModal: PropTypes.func,
  clusterSizeRange: PropTypes.array,
  columnHeaders: PropTypes.array,
  minClusterCount: PropTypes.number,
  maxClusterCount: PropTypes.number,
  selectedClusters: PropTypes.array,
  isFiltering: PropTypes.bool,
  filterLoadingText: PropTypes.string,
  enableScatterplotTooltip: PropTypes.bool
};
