/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  text: {
    fontFamily: 'Open Sans, Lato, Roboto',
    color: '#323748',
    fontWeight: '400'
  }
}));

export default function CircularIndeterminate(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h3 className={classes.text}>{props.filterLoadingText}</h3>
      <CircularProgress style={{marginTop: '2vh'}} disableShrink variant='static' />
    </div>
  );
}