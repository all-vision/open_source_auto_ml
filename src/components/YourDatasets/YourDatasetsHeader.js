import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import YourDatasetsInfoFlag from './YourDatasetsInfoFlag';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaxDatasetSizeAlert from './MaxDatasetSizeAlert';
import '../../styles/YourDatasets/your-datasets-header.css';

// connect redux store to props
const mapStateToProps = (state) => {
  return {
    totalDataUsage: state.totalDataUsage,
  };
};

function ProjectDetailsHeader(props) {

  // helper function to convert raw number of bites into a more standard format (MB, KB, etc)
  const convertFileSize = (a) => {
    let b = 0,
      c = parseInt(a, 10) || 0;
    for (; 1024 <= c && ++b; ) c /= 1024;
    return (
      c.toFixed(10 > c && 0 < b ? 1 : 0) +
      ' ' +
      ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][b]
    );
  };

  return (
    <>
      <div className="project-details-header">
        <h1>Your Datasets</h1>
        <Button
          className="project-details-header-button upload-dataset-button"
          variant="contained"
          color="primary"
          onClick={props.handleUploadDataModalOpen}
        >
          <PublishIcon className="upload-data-icon"></PublishIcon>Upload Dataset
        </Button>
      </div>
      {!props.selectedDataset ? (
        <YourDatasetsInfoFlag></YourDatasetsInfoFlag>
      ) : null}
      <MaxDatasetSizeAlert />
      {
        props.usage
          ?
          <div
            style={{ marginTop: '1vh', display: 'flex', flexDirection: 'column' }}
          >
            <label className="existing-data-count">
          Current data usage: {convertFileSize(props.usage)}{' '}
              <b>
            ({Math.round((props.usage / 50000000) * 100)}% of 50MB
            Limit)
              </b>
            </label>
            <progress
              value={props.usage}
              className="your-datasets-progress-bar"
              max="50000000"
            ></progress>
          </div>
          : null
      }

    </>
  );
}

export default connect(mapStateToProps)(ProjectDetailsHeader);

ProjectDetailsHeader.propTypes = {
  handleUploadDataModalOpen: PropTypes.func,
  selectedDataset: PropTypes.object,
  existingFileSize: PropTypes.number,
  totalDataUsage: PropTypes.number,
  usage: PropTypes.number
};
