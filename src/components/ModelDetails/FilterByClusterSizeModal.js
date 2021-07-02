/* eslint-disable react/prop-types */
import React, { useState, useEffect, FC } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FilterByClusterSlider from './FilterByClusterSlider';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import '../../styles/ModelDetails/filter-by-cluster-size-modal.css';

function getModalStyle() {
  const top = 40;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const SimpleModal = (props) => {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (props.filterByClusterSizeModalIsOpen) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [props.filterByClusterSizeModalIsOpen]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="filter-by-cluster-size-modal-wrapper">
        <h2 id="simple-modal-title">Filter by cluster size</h2>
        <p>Filter clusters by number of points.</p>
        <FilterByClusterSlider
          min={props.minClusterCount}
          max={props.maxClusterCount}
          handleCloseFilterByClusterSizeModal={props.handleCloseFilterByClusterSizeModal}
          handleFilterDataByClusterSize={props.handleFilterDataByClusterSize}
        />
        <SimpleModal />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.handleCloseFilterByClusterSizeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default SimpleModal;
