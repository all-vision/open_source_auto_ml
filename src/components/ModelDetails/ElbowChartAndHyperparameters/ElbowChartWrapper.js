/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ElbowChart from './ElbowChart';
import '../../../styles/ModelDetails/HyperParameterAndElbow/elbow-chart.css';

export default function ElbowChartWrapper(props) {
  return (
    <div className="elbow-chart">
      <div className="elbow-chart-header">
        <h1>Research Module: Elbow Chart</h1>
        <FormControl
          style={{ minWidth: 120 }}
          className="select-hyperparameter"
        >
          <InputLabel id="demo-simple-select-label">
              Select Hyperparameter
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.elbowChartDropdownValue}
            style={{ overflowX: 'hidden' }}
            onChange={(e) => props.handleUpdateSelectedHyperparameter(e)}
          >
            {props.hyperparameters.map((param, index) => {
              return (
                <MenuItem value={param.name} key={index}>
                  {param.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <ElbowChart
        elbowChartDropdownValue={props.elbowChartDropdownValue}
      ></ElbowChart>
    </div>
  );
}
