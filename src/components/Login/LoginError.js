import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import PropTypes from 'prop-types';
import '../../styles/common.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function DescriptionAlerts(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert className='alert-error-bg' severity="error" variant="outlined">
        {props.loginErrorCopy}
      </Alert>
    </div>
  );
}

DescriptionAlerts.propTypes = {
  loginErrorCopy: PropTypes.string
};