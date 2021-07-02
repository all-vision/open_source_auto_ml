/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import '../../styles/ClusterExploration/cluster-exploration-wrapper.css';


export default function ClusterExplorationActions(props) {
  const [model, setModel] = useState({
    value: 'kmeans'
  });

  return (
    <div className="cluster-exploration-actions-wrapper">
      <FormControl style={{ minWidth: 150 }} error={props.selectedXValueIsNull}>
        <InputLabel id="demo-simple-select-label">Select Model</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ overflowX: 'hidden' }}
          onChange={(e) => props.handleChangeModel(e.target.value)}
          value={props.activeModel}
        >
          {props.allModelNames.map((model, index) => {
            return (
              <MenuItem value={model} key={index}>
                {model}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        disabled={props.checkedClusters.length < 2}
        style={{
          background: props.checkedClusters.length < 2 ? ' #eee' : '#1565C0',
          fontFamily: 'Open Sans, Lato, Roboto',
          color: props.checkedClusters.length < 2 ? '#ccc' : '#fafafa',
          textTransform: 'capitalize',
          cursor: props.checkedClusters.length < 2 ? 'not-allowed' : 'pointer',
          marginLeft: '2vw',
          marginTop: '1vh'
        }}
        onClick={props.displayChart}
      >

        <CompareArrowsIcon
          style={{
            marginRight: '.5vw',
          }}
        />
        Compare Clusters
      </Button>
      <Button
        variant="contained"
        onClick={props.clearChart}
        style={{
          marginLeft: '2vw',
          marginTop: '1vh',
          textTransform: 'capitalize',
          background: '#e8e8e8',
          boxShadow: 'none',
          color: '#323748',
          fontWeight: 600,
          fontFamily: 'Open Sans, Lato, Roboto'
        }}
      >
        Reset 
        Clusters
      </Button>
    </div>
  );
}