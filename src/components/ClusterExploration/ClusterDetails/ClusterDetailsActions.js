/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import {FormControlLabel, Button, MenuItem, Select, InputLabel} from '@material-ui/core';
// import '../styles/ClusterExploration/cluster-details-actions.css';
import '../../../styles/ClusterExploration/cluster-details-actions.css';

const StyledSwitch = withStyles({
  switchBase: {
    color: '#eee',
    '&$checked': {
      color: '#1565C0',
    },
    '&$checked + $track': {
      backgroundColor: '#C3C5C8',
    },
  },
  checked: {},
  track: {
    background: 'rgba(50,55,73,.8)',
    '&$checked': {
      background: '#1565C0',
    },
  },
})(Switch);

export default function ClusterDetailsActions(props) {
  const [columnNames, setColumnNames] = useState([]);
  const [selectedXValue, setSelectedXValue] = useState('');
  const [selectedYValue, setSelectedYValue] = useState('');
  const [activeModel, setActiveModel] = useState('Kmeans');
  const [modelNames, setModelNames] = useState([]);


  const handleResetData = () => {
    props.handleResetData();
    setSelectedXValue('');
    setSelectedYValue('');
  };

  return (
    <div className='cluster-details-actions-wrapper'>
      {/* <FormControlLabel
        checked={props.showAllOtherClusters}
        onChange={props.handleToggleShowAllClustersTooltip}
        control={<StyledSwitch color='primary' />}
        label="Show All Other Clusters"
        labelPlacement="end"
      /> */}
      <FormControlLabel
        checked={props.showToolTip}
        onChange={props.handleToggleShowTooltipToggle}
        className='cluster-details-actions-display-tooltip-toggle'
        control={<StyledSwitch color='primary' />}
        label="Show Tooltip"
        labelPlacement="end"
      />
      {/*
        * ! commented out, uncomment tomrrow
      */}
      <FormControl
        style={{ minWidth: 150, marginLeft: '2vw' }}
        error={props.selectedXValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select X Value</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ overflowX: 'hidden' }}
          onChange={(e) => setSelectedXValue(e.target.value)}
          value={selectedXValue}
        >
          {props.integerOnlyColumnNames.map((column, index) => {
            return (
              <MenuItem value={column} key={index}>
                {column}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl
        style={{ minWidth: 150, marginLeft: '2vw' }}
        error={props.selectedYValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select Y Value</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ overflowX: 'hidden' }}
          value={selectedYValue}
          onChange={(e) => setSelectedYValue(e.target.value)}
        >
          {props.integerOnlyColumnNames.map((column, index) => {
            return (
              <MenuItem value={column} key={index}>
                {column}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        style={{
          marginLeft: '1.5vw',
          marginTop: '1.5vh',
          color: '#1565C0',
          border: '1px solid #1565C0',
          fontFamily: 'Open Sans, Lato, Roboto',
          textTransform: 'capitalize',
          fontSize: '.9rem',
        }}
        variant="outlined"
        color="primary"
        onClick={() => props.handleSubmitXYValues(selectedXValue, selectedYValue)}
      >
        Reassign X & Y Values
      </Button>
      <Button
        onClick={handleResetData}
        style={{
          marginLeft: '1vw',
          marginTop: '1.5vh',
          textTransform: 'capitalize',
        }}
      >
        Reset Data
      </Button>
    </div>
  );
}