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
    marginLeft: '1.5vw',
    overflow: 'hidden',
    minWidth: 420,
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
      <h3
        style={{
          fontFamily: 'Open Sans, Lato, Roboto',
          fontSize: '1rem',
          marginLeft: '1vw',
          marginTop: '1vw',
        }}
      >
        Filter Results by Time
      </h3>
      <FormControl className={classes.formControl}>
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.timeSelectValue}
          onChange={props.handleTimeSelectChange}
        >
          <MenuItem value={'Today'}>Today</MenuItem>
          <MenuItem value={'Yesterday'}>Yesterday</MenuItem>
          <MenuItem value={'This Week'}>This Week</MenuItem>
          <MenuItem value={'Last Thirty Days'}>Last 30 Days</MenuItem>
          <MenuItem value={'This Month'}>This Month</MenuItem>
          <MenuItem value={'This Year'}>This Year</MenuItem>
          <MenuItem value={'All Time'}>All Time</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
