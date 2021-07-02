import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'min-content',
    whiteSpace: 'nowrap',
    border: '1.5px solid #1565C0',
    borderRadius: '3px',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleAlerts() {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{marginTop: '1vh'}}>
      <Alert severity="info">Datasets are limited to 15MB</Alert>
    </div>
  );
}