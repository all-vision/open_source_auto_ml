import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import '../../styles/YourDatasets/combine-datasets-modal.css';

function getModalStyle() {
  const top = 35;
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
  const [datasets, setDatasets] = React.useState(props.fileInformation);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setOpen(props.combineDatasetsModalIsOpen);
  }, [props.combineDatasetsModalIsOpen]);

  useEffect(() => {
    setDatasets(props.fileInformation);
  }, [props.fileInformation]);

  let test = [];
  if (datasets) {
    test = datasets.filter((set) => set.checked === true);
  } else {
    test = '';
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="combine-datasets-modal-wrapper">
        <h1>Combine Datasets Modal</h1>
        <h3>Select datasets you want to combine.</h3>
        <div className="combine-datasets-checkbox-wrapper">
          {datasets
            ? datasets.map((file, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={file.checked}
                      color="primary"
                      name={file.fileName}
                      onChange={props.handleCheckForCombine}
                    />
                  }
                  label={file.fileName}
                />
              );
            })
            : 'asdasdasd'}
        </div>
        <p className="selected-datasets-count">
          {test.length === 1
            ? `${test.length} dataset selected`
            : `${test.length} datasets selected`}
        </p>
        <div className="combine-datasets-buttons-wrapper">
          <Button
            className="combine-datasets-button cancel"
            variant="contained"
            color="default"
            onClick={props.handleCombineDatasetsModalClose}
          >
            Cancel
          </Button>
          <Button
            className="combine-datasets-button combine"
            variant="contained"
            color="primary"
          >
            Combine
          </Button>
        </div>
      </div>
      <SimpleModal />
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCombineDatasetsModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

SimpleModal.propTypes = {
  combineDatasetsModalIsOpen: PropTypes.bool,
  handleCombineDatasetsModalClose: PropTypes.func,
  handleCheckForCombine: PropTypes.func,
  fileInformation: PropTypes.array,
  files: PropTypes.array
};