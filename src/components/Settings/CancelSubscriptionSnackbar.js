/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '40%',
    '& > * + *': {
      marginTop: theme.spacing(5),
    },
  },
}));

/*
* Material UI Snackbar element to be rendered when a user successfully cancels their subscription
* https://material-ui.com/components/snackbars/
*/

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (props.showCancelSubscriptionSnackbar) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [
    props.showCancelSubscriptionSnackbar,
    props.cancelSubscriptionApiResponseStatus,
    props.cancelSubscriptionSnackbarText,
  ]);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          style={{background: '#43AA8B'}}
          severity={
            props.cancelSubscriptionApiResponseStatus === 200
              ? 'success'
              : 'error'
          }
        >
          {props.cancelSubscriptionSnackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
}
