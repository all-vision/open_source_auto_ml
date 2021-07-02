/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import '../../styles/ModelDetails/deploy-model-modal.css';

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
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 1),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.deployModelModalIsOpen);
  }, [props.deployModelModalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="deploy-model-modal-wrapper">
        <h1 id="simple-modal-title">Deploy Model as API</h1>
        <p>
          This will deploy this model as an external API that you can call from
          a web application or a Jupyter notebook.
        </p>
        <p>
          You can find all of your deployed models on the
          <b>View Deployed Models</b>
          , page accessible on the sidebar
          navigation.
        </p>
        <SimpleModal />
        <div className="deploy-model-modal-buttons">
          <Button
            className="deploy-model-modal-button cancel"
            variant="contained"
            color="default"
            onClick={props.handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            className="deploy-model-modal-button deploy"
            variant="contained"
            color="primary"
            onClick={props.handleOpenAccessAPIModal}
          >
            Deploy
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
