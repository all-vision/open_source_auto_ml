/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl className="admin-page-time-select">
        <InputLabel id="demo-simple-select-label">Select Time Range</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{overflowX:'hidden'}}
          placeholder='Today'
          value={props.selectedTimeRange}
          onChange={(e) => props.handleUpdateSelectedTimeRange(e)}
        >
          <MenuItem value={'Today'}>Today</MenuItem>
          <MenuItem value={'This Week'}>This Week</MenuItem>
          <MenuItem value={'This Month'}>This Month</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
