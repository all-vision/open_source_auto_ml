/* eslint-disable react/prop-types */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function SimpleSelect(props) {
  return (
    <div>
      <FormControl className="action-log-select-function">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          placeholder="select column to be label"
          value={
            props.labelIndex !== -1
              ? props.options[props.labelIndex]
              : 'No Label'
          }
          onChange={props.handleLabelUpdate}
          style={{ overflowX: 'hidden' }}
        >
          <MenuItem value={'No Label'}>No Label</MenuItem>
          {props.options.map((option, index) => {
            return (
              <MenuItem value={option} key={index}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
