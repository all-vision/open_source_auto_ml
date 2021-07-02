/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 900,
    padding: '2rem',
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const marks = [
  {
    value: 10,
    label: 'Two Weeks Ago',
  },
  {
    value: 50,
    label: 'Last Week',
  },
  {
    value: 90,
    label: 'This Week',
  },
  {
    value: 140,
    label: 'test Week',
  },
];

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          fontFamily: 'Open Sans, Lato, Roboto',
          marginBottom: '1vh',
          fontSize: '1.2rem',
        }}
      >
        <p>Active Timeframe:</p>
        <p style={{ marginLeft: '.5vw' }}>
          {props.sliderValue <= 10
            ? 'Two Weeks Ago'
            : props.sliderValue <= 50
              ? 'Last Week'
              : 'This Week'}
        </p>
      </div>
      <Slider
        // defaultValue={90}
        value={props.sliderValue}
        onChange={(event, value) => props.handleSliderChange(event, value)}
        onChangeCommitted={props.handleSliderChangeComitted}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-always"
        step={1}
        marks={marks}
      />
    </div>
  );
}
