import React, { useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import googleLogo from '../../assets/chrome_icon.svg';
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
* modal to be rendered when a user is using a browser other than Google Chrome
*/

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(!props.isChrome);
  }, [props.isChrome]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="is-chrome-modal">
        <img
          src={googleLogo}
          alt="google logo"
          className="is-chrome-modal-chrome-logo"
        ></img>
        <h1>We noticed you&apos;re not using Google Chrome</h1>
        <p>
          Some features may not work as intended on all browsers. Please use
          Google Chrome for the best experience.
        </p>
        <Button
          className="is-chrome-modal-button"
          variant="contained"
          color="primary"
          onClick={() => setOpen(false)}
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
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

SimpleModal.propTypes = {
  isChrome: PropTypes.bool,
};
