/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import '../../styles/ModelDetails/new-model-name-modal.css';
import { connect } from 'react-redux';

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
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const mapStateToProps = (state) => {
  return {
    allModelNames: state.allModelNames,
  };
};

/*
* modal to let user create a name for their new model
*/
function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [newModelName, setNewModelName] = React.useState('');
  const [modelNameError, setModelNameError] = React.useState(false);
  const [modelErrorText, setModelErrorText] = React.useState('');

  useEffect(() => {
    if (props.newModelNameModalIsOpen) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [props.newModelNameModalIsOpen]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSetNewModelName = () => {
    const allModelNames = props.allModelNames.map((model) =>
      model.ModelName.toLowerCase().trim()
    );


    if (!newModelName.length > 0) {
      setModelNameError(true);
      setModelErrorText('Model Name cannot be blank.');
      return;
    }
      
    if (allModelNames.includes(newModelName.toLowerCase().trim())) {
      alert('match');
      setModelNameError(true);
      setModelErrorText('A Model with that name already exists');
      return;
    }

    setModelNameError(false);
    setNewModelName('');
    props.handleSubmitHyperparameters(newModelName);
    props.handleCloseNewModelNameModal();
  };

  const handleClose = () => {
    props.handleCloseNewModelNameModal;
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Alert
        severity="error"
        style={{
          border: '1px solid #D32E2E',
          display: modelNameError ? 'flex' : 'none',
        }}
      >
        {modelErrorText}
      </Alert>
      <div className="new-model-name-modal-wrapper">
        <h2 id="simple-modal-title">Create new model</h2>
        <p id="simple-modal-description">
          This will create a new model with the updated hyperparameters.
        </p>
        <TextField
          id="standard-basic"
          label="New Model Name"
          error={modelNameError}
          className="create-new-model-modal-input"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
        />
        <Button
          onClick={handleSetNewModelName}
          className="create-new-model-modal-button"
          variant="contained"
        >
          Create new model
        </Button>
        <SimpleModal />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCloseNewModelNameModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps)(SimpleModal);
