/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { assignModelToDEB } from '../../redux/actions/index';
import '../../styles/ModelDetails/deploy-model-modal.css';


// function mapDispatchToProps(dispatch) {
//   return {
//     assignModelToDEB: (model) => dispatch(assignModelToDEB(model)),
//   };
// }

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

function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.assignModelToDEBIsOpen);
  }, [props.assignModelToDEBIsOpen]);

  const assignNewModelToDeb = () => {
    props.assignModelToDEB(props.model);
    props.routeProps.history.push('/deb');
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="deploy-model-modal-wrapper">
        <h1 id="simple-modal-title">Assign this Model to Detect Emerging Behaviors</h1>
        <p className='warning'>
          Warning! This will redirect you to the Detect Emerging Behaviors Page.
        </p>
        <SimpleModal />
        <div className="deploy-model-modal-buttons">
          <Button
            className="deploy-model-modal-button cancel"
            variant="contained"
            color="default"
            onClick={props.handleCloseAssignModelToDEB}
          >
            Cancel
          </Button>
          <Button
            className="deploy-model-modal-button deploy"
            variant="contained"
            color="primary"
            onClick={assignNewModelToDeb}
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        Open Modal
      </button> */}
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

const mapDispatchToProps = { assignModelToDEB };
// export default function SimpleModal(props)
// export default connect(mapStateToProps)(ModelDetails);
export default connect(null, mapDispatchToProps)(SimpleModal);