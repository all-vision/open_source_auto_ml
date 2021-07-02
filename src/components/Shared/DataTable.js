/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Table,
  Column,
} from 'react-virtualized';
import { CSVLink } from 'react-csv';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import 'react-virtualized/styles.css';
import '../../styles/DEB/deb-table.css';

/*
 * map selectedDataset from redux to props
 */
const mapStateToProps = (state) => {
  return {
    selectedDataset: state.selectedDataset,
  };
};

/*
 * table to render the active dataset
 * uses react-virtualize to improve performance
 */
function DataTable(props) {
  // const [tableData, setTableData ] = useState([]);
  const [filteredByClusterString, setFilteredByClusterString] = useState('');
  const constants = ['x', 'y', 'cluster'];
  const XY = ['x', 'y', 'cluster'];

  /*
   * useEffect hook that runs whenever the selected clusters change
   * render string above table to let users know what data is being rendered
   * example:  if user has filtered data by cluster 2, return Table only showing data in cluster 2
   */
  useEffect(() => {
    let newString = '';
    if (props.selectedClusters.length > 0) {
      newString =
        props.selectedClusters.length === 1
          ? 'Table only showing data in cluster '
          : 'Table only showing data in clusters ';
      props.selectedClusters.forEach((cluster, index) => {
        if (
          index === props.selectedClusters.length - 1 &&
          props.selectedClusters.length > 1
        ) {
          const miniString = ` and ${cluster}. `;
          newString += miniString;
        } else {
          const miniString = `${cluster},`;
          newString += miniString;
        }
      });
    } else {
      newString =
        'Showing all data, use the filter by cluster dropdown above to zero in on a specific cluster. ';
    }

    setFilteredByClusterString(newString.slice(0, -1));
  }, [props.selectedClusters]);

  /*
   * if data is still loading return a skeleton component
   */
  if (!props.data.length > 0) {
    return <Skeleton variant="rect" width={1000} height={200} />;
  } else {
    return (
      <>
        <div className="data-table-container">
          <div className="deb-table-header">
            <div className='flex-column'>
              <h1>Your Dataset</h1>
              <p className="filtered-by-cluster-string">
                {filteredByClusterString}
              </p>
            </div>
            {props.targetRow ? (
              <Button
                onClick={props.handleResetTableData}
                style={{ marginLeft: '2vw' }}
              >
                Reset Table
              </Button>
            ) : null}
            <CSVLink
              data={props.data}
              filename={`allvision_file_${props.selectedDataset.DatasetName}`}
              className="deb-export-csv"
            >
              <p>
                <SaveAltIcon
                  fontSize={'default'}
                  style={{ marginRight: '.5vw' }}
                  className="model-details-export-as-csv-icon"
                ></SaveAltIcon>
                Export as CSV
              </p>
            </CSVLink>
          </div>
          <div className="data-table-wrapper">
            <Table
              width={300 * Object.keys(props.data[0]).length}
              height={300}
              rowClassName="table-row"
              headerHeight={50}
              rowHeight={50}
              rowCount={props.data.length}
              rowGetter={({ index }) => props.data[index]}
            >
              <Column
                // key={index}
                label={'cluster'}
                dataKey={'cluster'}
                width={Object.keys(props.data[0]).length * 20}
              />
              {Object.keys(props.data[0]).map((column, index) => {
                if (!XY.includes(column)) {
                  if (!constants.includes(column)) {
                    return (
                      <Column
                        key={index}
                        label={props.data[0][column]}
                        dataKey={column}
                        width={Object.keys(props.data[0]).length * 20}
                      />
                    );
                  } else {
                    return (
                      <Column
                        key={index}
                        label={column.toString()}
                        dataKey={column.toString()}
                        width={Object.keys(props.data[0]).length * 10}
                      />
                    );
                  }
                }
              })}
            </Table>
          </div>
          <div style={{ height: '100px' }}></div> {/* interesting spacing method */ }
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(DataTable);
