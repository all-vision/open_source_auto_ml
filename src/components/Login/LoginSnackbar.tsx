/* eslint-disable react/prop-types */
import React, { useState, useEffect, FC } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useEventCallback } from '@material-ui/core';

function Alert(props:any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

interface Props {
    showLoginSnackbar: boolean
}

const CustomizedSnackbars: FC<Props> = ({showLoginSnackbar}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (showLoginSnackbar) {
      setOpen(true);
    }
  }, [showLoginSnackbar]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar 
        open={open} 
        autoHideDuration={3000} 
        onClose={handleClose}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert onClose={handleClose} style={{background: '#43AA8B'}}>
          Success! Redirecting you now!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomizedSnackbars;