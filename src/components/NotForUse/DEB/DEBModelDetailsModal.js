/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import '../../styles/DEB/deb-model-details-modal.css';

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
    width: 450,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 3, 1),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(props.modelDetailsModalIsOpen);

  const { models, model } = props;
  //   console.log(models.indexOf(model));
  useEffect(() => {
    setOpen(props.modelDetailsModalIsOpen);
  }, [props.modelDetailsModalIsOpen]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div
      style={modalStyle}
      className={classes.paper}
      id="model-details-modal-wrapper"
    >
      {props.model ? (
        <div>
          <h1>{props.model ? props.model.name : null}</h1>
          <div className="model-details-modal-wrapper-metric-wrapper">
            <p className="model-details-modal-wrapper-metric">Clusters:</p>
            <p className="model-details-modal-wrapper-metric-value">
              {props.model.clusters}{' '}
            </p>
          </div>
          {
            props.model.classifiesAnamolies ? 
              <div className="model-details-modal-wrapper-metric-wrapper">
                <p className="model-details-modal-wrapper-metric">
            Classifies Anamolies:
                </p>
                <p className="model-details-modal-wrapper-metric-value">
                  {props.model.classifiesAnamolies.toString()}
                </p>
              </div>
              : null
          }

          <div className="model-details-modal-wrapper-metric-wrapper">
            <p className="model-details-modal-wrapper-metric">
              Downsampled Amount:
            </p>
            <p className="model-details-modal-wrapper-metric-value">
              {props.model.downsampledAmount}
            </p>
          </div>
          <div className="model-details-modal-wrapper-metric-wrapper">
            <p className="model-details-modal-wrapper-metric">
              Silouette Score:
            </p>
            <p className="model-details-modal-wrapper-metric-value">
              {props.model.silouette}
            </p>
          </div>
          <Tooltip title="This link will take you to a new page." placement="top-start" arrow>
            <Link to={`/modeldetails/${props.models.findIndex((e) => e.name === props.model.name)}`} style={{textDecoration: 'none'}}>
              <Button
                color="primary"
                className="deb-model-details-modal-button"
                variant="contained"
                style={{textTransform: 'capitalize'}}
              >
                <OpenInNewIcon style={{marginRight: '.5vw'}}></OpenInNewIcon>
            View more details
              </Button>
            </Link>
          </Tooltip>
        </div>
      ) : null}

      {/* <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p> */}
      <SimpleModal />
    </div>
  );

  return (
    <div>
      <Modal
        open={props.modelDetailsModalIsOpen}
        onClose={props.handleCloseDEBModelDetailsModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
