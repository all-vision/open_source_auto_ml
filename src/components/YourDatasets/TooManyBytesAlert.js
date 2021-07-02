import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '1vh',
  },
}));

export default function SimpleAlerts(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Alert
        className='alert-error-bg'
        severity="error"
        variant="outlined"
        onClose={props.handleCloseTooManyBytesAlert}
      >
        Uploading this file would exceed 50MB Limit. <b>Upload has been aborted.</b>
      </Alert>
    </div>
  );
}

SimpleAlerts.propTypes = {
  handleCloseTooManyBytesAlert: PropTypes.func,
};
