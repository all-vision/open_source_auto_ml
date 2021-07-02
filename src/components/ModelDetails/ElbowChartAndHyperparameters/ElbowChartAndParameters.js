/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import HyperparametersWrapper from './HyperparametersWrapper';
import ElbowChartWrapper from './ElbowChartWrapper';
import '../../../styles/ModelDetails/elbow-chart-parameters.css';

export default function ElbowChartAndParameters(props) {
  if (props.selectedDataset.DatasetID != 988) {
    return (
      <div className="elbow-chart-and-hyperparameters-wrapper">
        <div className="hyperparameters-wrapper">
          <HyperparametersWrapper
            model={props.model}
            modelHyperparameters={props.modelHyperparameters}
            defaultHyperparameters={props.defaultHyperparameters}
            hyperparameterErrorInputs={props.hyperparameterErrorInputs}
            handleOpenNewModelNameModal={props.handleOpenNewModelNameModal}
            handleUpdateHyperparameter={props.handleUpdateHyperparameter}
            handleSubmitHyperparameters={props.handleSubmitHyperparameters}
            handleResetHyperparameters={props.handleResetHyperparameters}
            hyperparameters={props.hyperparameters}
          ></HyperparametersWrapper>
        </div>
        <div className="elbow-chart-wrapper">
          {/* <ElbowChartWrapper
            elbowChartDropdownValue={props.elbowChartDropdownValue}
            elbowChartData={props.elbowChartData}
            hyperparameters={props.hyperparameters}
            handleUpdateSelectedHyperparameter={
              props.handleUpdateSelectedHyperparameter
            }
          ></ElbowChartWrapper> */}
        </div>
      </div>
    );
  } else {
    return null;
  }

}