/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import SucessMessageCheckIcon from './RunningModelZoo/SucessMessageCheckIcon';
import '../../styles/YourDatasets/uploading-data-screen.css';

export default function UploadingDataScreen(props) {
  // destructure props
  const { fileName, fileColumns, fileRows, fileSize, fileType } = props.fileBeingUploaded;
  const [uploadIsDone, setUploadIsDone] = useState(false);

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

  useEffect(() => {
    if (!props.uploadingData) {
      setTimeout(() => {
        setUploadIsDone(true);
      }, 1000);
    }
  }, [props.uploadingData]);

  return (
    <section className='uploading-data-container'>
      <div className='uploading-data-screen-wrapper'>
        {
          (() => {
            if (uploadIsDone) {
              return (
                <div className='uploading-data-screen-header'>
                  <h1 className='uploading-data-screen-title'>
                        Dataset Uploaded Successfully!
                  </h1>
                  <svg
                    className="uploading-data-screen-success-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="uploading-data-screen-success-icon__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="uploading-data-screen-success-icon__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
              );
            } else {
              return (
                <>
                  <div className='uploading-data-screen-header'>
                    <h1 className='uploading-data-screen-title'>
                          Uploading Your Dataset
                    </h1>

                    <CircularProgress className='uploading-data-screen-spinner' />
                  </div>
                  <h3 className='uploading-data-screen-subtitle'>
                    Upload time depends on the size of the dataset, please be patient.
                  </h3>
                </>
              );
            }
          })()
        }

        <div className='uploading-data-screen-content-wrapper'>
          <h3>File information</h3>
          <p>File Name: <strong>{fileName}</strong></p>
          <p>File Size: <strong>{convertFileSize(fileSize)} ({fileRows} rows, {fileColumns} columns)</strong></p>
        </div>
      </div>
    </section>
  );
}