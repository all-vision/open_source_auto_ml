/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ActionLogModalSelect from './ActionLogModalSelect';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SelectLabelDropdown from '../SelectLabelDropdown';
import Button from '@material-ui/core/Button';
import '../../../styles/DataCleaning/ActionLog/action-log-new-step-modal.css';

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

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setOpen(props.addNewStepModalIsOpen);
  }, [props.addNewStepModalIsOpen]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="action-log-add-new-step-modal-wrapper">
        <h1>Add a new step</h1>
        <div>
          <h3>Select Functions</h3>
          <ActionLogModalSelect
            action={props.action}
            handleChange={props.handleSetAction}
            className="action-log-select-function"
          />
        </div>
        <div
          className="action-log-checkbox-wrapper"
          style={{
            display:
              props.action !== 'none' && props.action !== 'select_label'
                ? 'flex'
                : 'none',
          }}
        >
          <h3>Select Columns</h3>
          {props.action
            ? props.columns.map((col, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={col.checked}
                      name={col.columnName}
                      color="primary"
                      onChange={props.handleCheckForCombine}
                    />
                  }
                  label={col.columnName}
                />
              );
            })
            : ''}
        </div>
        <div
          style={{ display: props.action === 'select_label' ? 'flex' : 'none' }}
          className="select-label-dropdown-wrapper"
        >
          <h3 className="select-label-subtitle">select label</h3>
          <SelectLabelDropdown
            options={props.options}
            labelIndex={props.labelIndex}
            handleLabelUpdate={props.handleLabelUpdate}
          ></SelectLabelDropdown>
        </div>
        <div className="action-log-add-new-step-buttons-wrapper">
          <Button
            color="default"
            variant="contained"
            onClick={props.handleModalClose}
            className="action-log-add-new-step-button cancel"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            className="action-log-add-new-step-button save"
            onClick={props.handleSaveAction}
            variant="contained"
          >
            Save
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
        onClose={props.handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
