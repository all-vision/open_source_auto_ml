/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../../styles/DataCleaning/data-cleaning-file-details.css';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { CSVLink } from 'react-csv';

export default class DataCleaningFileDetails extends Component {

  render() {
    return (
      <div className="data-cleaning-file-details-wrapper">
        <h2>{this.props.fileName}</h2>
        <p><span>{this.props.columnsCount}</span> Columns</p>
        <p><span>{this.props.rowsCount}</span> Rows</p>
        <CSVLink data={this.props.data} className="data-cleaning-export-csv">
          <p>
            <SaveAltIcon 
              style={{marginRight: '.5vw'}} 
              fontSize={'default'}
              className="export-as-csv-icon"
            ></SaveAltIcon>
                    Export as CSV
          </p>
        </CSVLink>
      </div>
    );
  }
}