/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 30;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    borderRadius: '3px',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.datasetTooLarge);
  }, [props.datasetTooLarge]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 id="simple-modal-title" style={{
        fontFamily: 'Open Sans, Lato, Roboto',
        color: '#323748',
        fontWeight: '600',
      }}>Dataset Is Too Large</h2> */}
      <div className={classes.root}>
        <Alert severity="warning" style={{
          fontFamily: 'Open Sans, Lato, Roboto',
          color: '#323748',
          fontWeight: '600',
        }}>Dataset Is Too Large!</Alert>
      </div>
      <h3 id="simple-modal-description"
        style={{
          fontFamily: 'Open Sans, Lato, Roboto',
          color: '#323748',
          fontWeight: '700',
          fontSize: '1.2rem',
          marginTop: '1.5vh'
        }}
      >
        Upload Aborted.
      </h3>
      <p id="simple-modal-description"
        style={{
          fontFamily: 'Open Sans, Lato, Roboto',
          color: '#323748',
          fontWeight: '500',
          fontSize: '1.1rem',
          marginTop: '.5vh'
        }}
      >
        Please upload a dataset that is smaller than 15MB.
      </p>
      <Button 
        onClick={() => props.handleCloseDatasetTooBigModal()}
        variant='contained' style={{
          marginTop: '1vh',
          background: '#1565C0',
          color: '#fafafa',
          fontFamily: 'Open Sans, Lato, Roboto',
          textTransform: 'capitalize'
        }}>Close Modal</Button>
      <SimpleModal />
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={() => props.handleCloseDatasetTooBigModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}