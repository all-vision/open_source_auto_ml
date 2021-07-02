/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import '../../styles/ModelDetails/access-api-modal.css';

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
    width: 500,
    borderRadius: '5px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 3, 4),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.accessAPIModalIsOpen);
  }, [props.accessAPIModalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="access-api-modal-wrapper">

        <Alert
          filled
          icon={
            <CheckCircleOutlineIcon
              style={{ color: '#43AA8B'}}
            ></CheckCircleOutlineIcon>
          }
          severity="success"
          variant="outlined"
          style={{ fontSize: '1rem', width: '90%', background: '#edf7ed' }}
        >
          Your Model has been Deployed!
        </Alert>
        <div className="api-key-wrapper">
          <h3>API Key</h3>
          <TextField
            variant="outlined"
            placeholder="59f170ed18mshe8bab8fa9cd6f36p184ceejsn66456cb7d3e1"
            value={'59f170ed18mshe8bab8fa9cd6f36p184ceejsn66456cb7d3e1'}
            className="api-key-wrapper-textfield"
          ></TextField>
        </div>
        <div className="code-snippet-wrapper">
          <div className="code-snippet-wrapper-header">
            <h3>Code Snippets</h3>
            <FormControl style={{ minWidth: 200 }} className="select-language">
              <InputLabel id="demo-simple-select-label">
                Select Clusters
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ overflowX: 'hidden' }}
                value={'Python'}
              >
                <MenuItem value={'Python'}>Python</MenuItem>
                <MenuItem value={'JavaScript'}>JavaScript</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="code-snippet">
            <TextField
              variant="outlined"
              placeholder={
                'import requests url = "https://top_label/2010-04-01/Account"'
              }
              value={
                'import requests url = "https://top_label/2010-04-01/Account"'
              }
              className="api-key-wrapper-textfield"
            ></TextField>
          </div>
        </div>
        <Button
          style={{
            marginTop: '3vh',
            fontFamily: 'Open Sans, Lato, Roboto',
            textDecoration: 'none',
            width: '95%',
          }}
          color="primary"
          variant={'contained'}
        >
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="access-api-link"
          >
            Access API
          </a>
        </Button>

        <div className="access-api-buttons-wrapper">
          <Button
            className="access-api-button cancel"
            color="default"
            onClick={props.handleCloseAccessAPIModal}
          >
            Close Modal
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
