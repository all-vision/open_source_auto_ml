/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import '../../styles/Settings/delete-account-modal.css';
import { Step } from '@material-ui/core';

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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

/*
* Modal to allow user to cancel their subscription
*/

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (props.deleteAccountModalIsOpen) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [props.deleteAccountModalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="delete-account-modal">
        <h2 id="simple-modal-title" className="delete-account-modal-title">
          Are you sure?
        </h2>
        <p
          id="simple-modal-description"
          className="delete-account-modal-subtitle"
        >
          This is a destructive action and will cancel your allvision subscription.
        </p>
        <div className='cancel-subscription-modal-buttons-wrapper'>
          <Button
            variant="contained"
            className="delete-account-modal-button cancel"
            onClick={props.handleCloseDeleteAccountModal}
          >
          Close
          </Button>
          <Button
            variant="contained"
            className="delete-account-modal-button delete"
            onClick={props.handleCancelSubscription}
          >
          Cancel Subscription
          </Button>
        </div>

        <SimpleModal />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCloseDeleteAccountModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
