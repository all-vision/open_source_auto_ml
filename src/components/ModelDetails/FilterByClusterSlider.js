/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { FormHelperText, FormControl } from '@material-ui/core';
import '../../styles/ModelDetails/filter-by-cluster-size-modal.css';

const useStyles = makeStyles({

});

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([props.min, props.max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMinInputChange = (event) => {
    let newValue = event.target.value;
    let existingState = [...value];
    let newState = [parseFloat(newValue), existingState[1]];
    setValue(newState);
  };

  const handleMaxInputChange = (event) => {
    let newValue = event.target.value;
    let existingState = [...value];
    let newState = [existingState[0], parseFloat(newValue)];
    setValue(newState);
  };

  return (
    <div className={classes.root}>
      <div className="filter-by-cluster-slider-wrapper">
        <Slider
          value={value}
          className="filter-by-cluster-slider"
          onChange={handleChange}
          min={props.min}
          max={props.max}
          valueLabelDisplay="off"
          aria-labelledby="range-slider"
          getAriaValueText={valuetext}
        />
        <div className="filter-by-cluster-inputs-wrapper">
          <div className="min-cluster-size-input-wrapper">
            <Input
              label="Min Cluster Size"
              variant="filled"
              type='number'
              value={value[0]}
              className="filter-by-clusters-input"
              size="small"
              onChange={(e) => handleMinInputChange(e)}
              inputProps={{
                step: 10,
                min: props.min,
                max: props.max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            ></Input>
            <FormHelperText margin="dense" className="filter-by-cluster-slider-helper-text">Minimum Cluster Size</FormHelperText>
          </div>
          <div className="max-cluster-size-input-wrapper">
            <Input
              label="Max Cluster Size"
              variant="filled"
              value={value[1]}
              type='number'
              helpertext="Incorrect entry."
              className="filter-by-clusters-input"
              size="small"
              onChange={(e) => handleMaxInputChange(e)}
              inputProps={{
                step: 10,
                min: props.min,
                max: props.max,
                type: 'number',
                'aria-label': 'weight',
                'aria-labelledby': 'input-slider',
              }}
            ></Input>
            <FormHelperText margin="dense" className="filter-by-cluster-slider-helper-text">Maximum Cluster Size</FormHelperText>
          </div>
        </div>
        <div className="filter-by-cluster-size-buttons-wrapper">
          <Button
            onClick={props.handleCloseFilterByClusterSizeModal}
            className="filter-by-cluster-slider-button clear"
            color="default"
            // variant="contained"
          >
          Close
          </Button>
          <Button
            className="filter-by-cluster-slider-button submit"
            onClick={() => props.handleFilterDataByClusterSize(value)}
            color="default"
          >
          Apply Changes
          </Button>
        </div>

      </div>
    </div>
  );
}
