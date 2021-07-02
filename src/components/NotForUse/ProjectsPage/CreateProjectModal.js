/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import '../../styles/Projects/create-project-modal.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');

  const handleInputChange = (e) => {
    setNewProjectName(e.target.value);
  };

  useEffect(() => {
    setNewProjectName('');
    setOpen(props.modalIsOpen);
  }, [props.modalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className="create-project-form">
        <h2 id="simple-modal-title">Create New Project</h2>
        <TextField
          error={props.modalError}
          id="outlined-basic"
          label={'Project Name'}
          variant="outlined"
          className="create-project-form-input"
          value={newProjectName}
          onChange={handleInputChange}
        />
        <div className="create-project-buttons-wrapper">
          <Button
            className="create-project-form-button cancel"
            variant="contained"
            color="default"
            onClick={props.handleModalClose}
          >
            Cancel
          </Button>
          <Button
            className="create-project-form-button submit"
            variant="contained"
            color="primary"
            onClick={() => props.handleProjectCreation(newProjectName)}
          >
            Create Project
          </Button>
        </div>
      </form>
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
