/* eslint-disable react/prop-types */
import React, { Component, useEffect, useState } from 'react';
import ModelCardChart from './ModelCardChart';
import Skeleton from '@material-ui/lab/Skeleton';
import ToolTip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import { withStyles } from '@material-ui/core/styles';
import '../../styles/ModelZoo/model-card.css';

/*
* card component for each model
*/

const IconToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#1565C0',
    fontSize: '1.00rem',
  }
}))(ToolTip);

export default function ModelCard(props) {
  return (
    <div
      onClick={() => props.handleSelectActiveModel(props.model)}
      className="model-card"
    >
      <div>
        <div className="model-card-chart-wrapper">
          {props.model.chartData ? (
            <ModelCardChart
              chartData={props.model.chartData}
              chartClusters={props.model.chartClusters}
            ></ModelCardChart>
          ) : (
            <Skeleton
              animation="wave"
              variant="rect"
              width={450}
              height={250}
            ></Skeleton>
          )}
        </div>
        <div className="model-card-header">
          {
            props.index === 0 ? (
              <IconToolTip title="Best Model" placement="top-start">
                <StarIcon className='icon' />
              </IconToolTip>

            ) : null
          }
          <h3>
            {props.model.ModelName}
            {props.isNewModel ? (
              <span className="custom-model-tag">(custom model)</span>
            ) : null}
          </h3>
        </div>

        {props.model.ModelScores
          ? Object.keys(props.model.ModelScores[0]).map((score, index) => {
            return (
              <div className="model-card-metric-wrapper" key={index}>
                <p className="model-card-metric">{score}</p>
                <p className="model-card-value">
                  {props.model.ModelScores[0][score]}
                </p>
              </div>
            );
          })
          : null}
      </div>
    </div>
  );
}
