/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../../../styles/ModelDetails/HyperParameterAndElbow/hyperparameter-wrapper.css';

export default function SimpleSelect(props) {


  const hiddenOverflow = {
    overflow: 'hidden'
  };
  return (
    <div style={hiddenOverflow}>
      <FormControl style={{ width: '200px', flexBasis: '27%', overflow: 'hidden' }}>
        <>
          <InputLabel>{props.param}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            style={hiddenOverflow}
            value={props.value}
            onChange={(e) => props.handleUpdateHyperparameter(e, props.param)}
          >
            {
              props.dropdownValues.map((value, index) => {
                return (
                  <MenuItem value={value} key={index}>{value}</MenuItem>
                );
              })
            }
          </Select>
        </>
      </FormControl>
    </div>
  );
}