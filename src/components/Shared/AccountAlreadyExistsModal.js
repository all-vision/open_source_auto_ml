import React, { useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../../styles/is-chrome-modal.css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: '45%',
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 'min-content',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    borderRadius: '7px',
  },
}));

/*
* render modal if account already exists
*/
export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.accountAlreadyExists);
  }, [props.accountAlreadyExists]);

  const handleAccountAlreadyExistsModalClose = () => {
    props.handleAccountAlreadyExists(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="is-chrome-modal">
        <h1>Account Already Exists</h1>
        <p>An account already exists with that email address.</p>
        <Button
          className="is-chrome-modal-button"
          variant="contained"
          color="primary"
          onClick={handleAccountAlreadyExistsModalClose}
        >
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleAccountAlreadyExistsModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

SimpleModal.propTypes = {
  accountAlreadyExists: PropTypes.bool,
  handleAccountAlreadyExists: PropTypes.func,
};
