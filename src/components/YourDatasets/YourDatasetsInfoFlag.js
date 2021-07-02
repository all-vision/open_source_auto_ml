import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function DescriptionAlerts() {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{marginTop: '1vh'}}>
      <Alert severity="info" style={{background: '#E8F4FD'}} variant="outlined">
      Click file name to run All Vision&apos;s suite of unsupervised algorithms in parallel on your chosen dataset
      </Alert>
    </div>
  );
}
