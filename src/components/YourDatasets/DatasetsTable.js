import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ProjectDetailsMenu from './YourDatasetsMenu';
import PropTypes from 'prop-types';
import { selectDataset } from '../../redux/actions/index';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import '../../styles/YourDatasets/your-datasets-table.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function mapStateToProps(state) {
  return {
    selectedDataset: state.selectedDataset,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    selectDataset: (dataset) => dispatch(selectDataset(dataset)),
  };
}

function BasicTable(props) {
  const classes = useStyles();
  function convertFileSize(a) {
    let b = 0,
      c = parseInt(a, 10) || 0;
    for (; 1024 <= c && ++b; ) c /= 1024;
    return (
      c.toFixed(10 > c && 0 < b ? 1 : 0) +
      ' ' +
      ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][b]
    );
  }

  // if (props.loading) {
  //   return <p>loading datasets.......</p>;
  // }

  if (1 === 0) {
    return (
      <>
        <TableContainer
          component={Paper}
          className="project-details-dataset-table"
        >
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Uploaded On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        <div className="no-files-found-wrapper">
          <h3 className="upload-files-prompt">No Files Found</h3>
          <p>Upload a .csv file to get started.</p>
        </div>
      </>
    );
  }
  return (
    <>
      <TableContainer
        component={Paper}
        className="project-details-dataset-table"
      >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Uploaded On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/*
                    {
                      DatasetID: 988,
                      DatasetIDRef: 'ec0fa8d1-c5b9-4d83-b457-3d248d9f3669',
                      DatasetName: 'heart.csv',
                      Location: 'user-datasets',
                      ModelZooIDs: null,
                      Original: true,
                      Size: 11325,
                      UploadDate: '2021-06-25T12:55:56.330832+00:00',
                      __typename: 'DatasetsTable'
                    }
            */}

            {1 === 1
              ? props.activeFiles.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      value={row}
                    >

                      <p
                        className="dataset-table-link"
                        onClick={() => {
                          props.selectDataset(row);
                          props.handleProcessData(row);
                        }}
             
                      >
                        {
                          props.selectedDataset 
                            ? 
                            <Tooltip title="Active Dataset">
                              <StarIcon
                                style={{
                                  visibility:
                                  props.selectedDataset &&
                                  row.DatasetIDRef ===
                                    props.selectedDataset.DatasetIDRef
                                    ? 'visible'
                                    : 'hidden',
                                  color: '#1565C0',
                                }}
                              ></StarIcon>
                            </Tooltip>
                            : null
                        }
                        <span >{row.DatasetName}</span>
                      </p>
                    </TableCell>
                    <TableCell align="right">
                      {convertFileSize(row.Size)}
                    </TableCell>
                    <TableCell align="right">csv</TableCell>
                    <TableCell align="right">
                      {row.UploadDate.slice(0, 10)}
                    </TableCell>
                    <TableCell align="right">
                      <ProjectDetailsMenu
                        index={index}
                        data={[]}
                        handleDeleteDataset={props.handleDeleteDataset}
                      ></ProjectDetailsMenu>
                    </TableCell>
                  </TableRow>
                );
              })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicTable);

BasicTable.propTypes = {
  handleDeleteDataset: PropTypes.func,
  handleSelectDataset: PropTypes.func,
  selectDataset: PropTypes.func,
  handleProcessData: PropTypes.func,
  files: PropTypes.array,
  activeFiles: PropTypes.array,
  selectedDataset: PropTypes.object,
  loading: PropTypes.bool,
};
