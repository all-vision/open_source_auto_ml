import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';
import PropTypes from 'prop-types';

export default function UploadCSV(props) {

  const handleOnDrop = (data, file) => {
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    props.handleUploadDataset(data, file);
    setTimeout(() => {
      props.handleUploadDataModalClose();
    }, 1000);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  return (
    <CSVReader
      onDrop={handleOnDrop}
      onError={handleOnError}
      addRemoveButton
      className="upload-csv-module"
      style={{
        dropArea: {
          borderColor: '#1565C0',
          background: 'rgba(21,101,192, .03)',
          height: 120,
          borderRadius: 0,
        },
        dropAreaActive: {
          borderColor: '#1565C0',
          background: 'rgba(21,101,192, .2)',
        },
        dropFile: {
          width: 100,
          height: 120,
          background: '#1565C0',
        },
        fileSizeInfo: {
          color: '#fafafa',
          backgroundColor: '#1565C0',
          fontFamily: 'Open Sans, Lato, Roboto',
          fontSize: '1.3rem',
          fontWeight: '600',
          borderRadius: 3,
          lineHeight: 1,
          marginBottom: '0.5em',
          padding: '0 0.4em',
        },
        fileNameInfo: {
          color: '#fafafa',
          opacity: '.7',
          fontFamily: 'Open Sans, Lato, Roboto',
          fontSize: '1.2rem',
          backgroundColor: '#1565C0',
          borderRadius: 3,
          fontSize: 14,
          lineHeight: 1,
          // padding: '0 0.4em',
        },
        removeButton: {
          color: '#1565C0',
        },
        progressBar: {
          backgroundColor: '#fafafa',
        },
      }}
      onRemoveFile={handleOnRemoveFile}
    >
      <span className="upload-data-modal-text">
          Click to upload CSV File.
      </span>
    </CSVReader>
  );
}

UploadCSV.propTypes = {
  handleUploadDataModalClose: PropTypes.func,
  handleUploadDataset: PropTypes.func,
};