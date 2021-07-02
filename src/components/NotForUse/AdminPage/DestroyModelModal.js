/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import '../../styles/AdminPage/destroy-model-modal.css';

function getModalStyle() {
  const top = 40;
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
    borderRadius: '5px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 4),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.destroyModelIsOpen);
  }, [props.destroyModelIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="destroy-model-modal-wrapper ">
        <h1 id="simple-modal-title">Are you absolutely sure?</h1>
        <p>
          This action
          {' '}
          <span>cannot</span>
          {' '}
          be undone. This will permanently
          destroy your deployment of the
          {' '}
          {props.modelToDestroy ? (
            <span>{props.modelToDestroy.modelName}</span>
          ) : (
            'nada'
          )}
          {' '}
          model
        </p>
        <div className="destroy-model-buttons-wrapper">
          <Button
            variant="contained"
            color="default"
            className="destroy-model-button cancel"
            onClick={props.handleModalClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="destroy-model-button destroy"
            onClick={() => props.destroy(props.modelToDestroy)}
          >
            Destroy
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
