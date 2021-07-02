/* eslint-disable react/prop-types */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function SimpleSelect(props) {

  return (
    <div>
      <FormControl className='action-log-select-function' >
        {/* <InputLabel id="demo-simple-select-label">Select Function</InputLabel> */}
        <Select
          value={props.action}
          onChange={props.handleChange}
          style={{overflowX: 'hidden'}}
        >
          <MenuItem value={'not_for_clustering'}>Do not use Columns for clustering</MenuItem>
          <MenuItem value={'select_label'}>Select Column as label</MenuItem>
          <MenuItem value={'one_hot_encode'}>One Hot Encode</MenuItem>
          <MenuItem value={'drop_columns'}>Drop Columns</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
