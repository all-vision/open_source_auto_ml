/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (props.newModelIsBeingCreated.isBeingCreated) {
      setOpen(true);
    }

  }, [props.newModelIsBeingCreated]);

  const handleClick = () => {
    setOpen(true);
  };

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
        autoHideDuration={null}
        onClose={handleClose}
        style={{background: '#43AA8B'}}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">
          <AlertTitle>New Model Has been Created</AlertTitle>
        </Alert>
      </Snackbar>
    </div>
  );
}
