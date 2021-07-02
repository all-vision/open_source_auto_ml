/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import '../../../styles/common.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    marginLeft: '1vw',
    marginTop: '1vh',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleAlerts(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error" className='alert-error-bg' variant='outlined'>{props.hyperparameterErrorMessage}</Alert>
    </div>
  );
}