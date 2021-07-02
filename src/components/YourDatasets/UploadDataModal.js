import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import UploadCSV from '../UploadData/UploadCSV';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import UploadDataWithDateFlag from './UploadDataWithDateFlag';
import '../../styles/YourDatasets/upload-dataset-modal.css';

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
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function UploadDataModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [uploadDataWithDateFlagIsOpen, setUploadDataWithDateFlagIsOpen] = React.useState(true);

  useEffect(() => {
    setOpen(props.uploadDataModalIsOpen);
  }, [props.uploadDataModalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="upload-data-modal">
        {/* {
          uploadDataWithDateFlagIsOpen 
            ? 
            <UploadDataWithDateFlag setUploadDataWithDateFlagIsOpen={setUploadDataWithDateFlagIsOpen} /> 
            : <Button onClick={() => setUploadDataWithDateFlagIsOpen(true)}>show message</Button>
        } */}
        <h1 id="simple-modal-title">Upload Your Files</h1>
        <h3>Files should be .csv</h3>
        <UploadCSV
          handleUploadDataset={props.handleUploadDataset}
          handleFileData={props.handleFileData}
          handleUploadDataModalClose={props.handleUploadDataModalClose}
        ></UploadCSV>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleUploadDataModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

UploadDataModal.propTypes = {
  handleUploadDataModalClose: PropTypes.func,
  handleFileData: PropTypes.func,
  handleUploadDataset: PropTypes.func,
  uploadDataModalIsOpen: PropTypes.bool,
};
