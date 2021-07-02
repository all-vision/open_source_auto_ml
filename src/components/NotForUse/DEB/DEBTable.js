/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import '../../styles/DEB/deb-table.css';

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: '3vh',
  },
  container: {
    maxHeight: 440,
    marginBottom: '5vh',
    overflowY: 'scroll',
  },
});

export default function BasicTable(props) {
  const classes = useStyles();
  const [dataToExport, setDataToExport] = useState([]);

  useEffect(() => {
    let filteredData = props.data.map(({x, y, ...remainingAttrs}) => remainingAttrs);
    setDataToExport(filteredData);
  }, []);

  return (
    <>
      <div className="deb-table-header">
        <h1>Your Dataset</h1>
        {props.targetRow ? (
          <Button
            onClick={props.handleResetTableData}
            style={{ marginLeft: '2vw' }}
          >
            Reset Table
          </Button>
        ) : null}
        <CSVLink data={dataToExport} className="deb-export-csv">
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
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              {Object.keys(props.data[0]).map((d, index) => {
                if (d != 'x' && d != 'y') {
                  if (d === 'cluster') {
                    return <TableCell align="left" key={index}>{props.data[0][d]}</TableCell>;
                  } else {
                    return <TableCell align="left" key={index}>{props.data[0][d]}</TableCell>;
                  }
                }
              })}
              <TableCell align="left">Emerging Behavior</TableCell>
              <TableCell align="left">Fraud</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.targetRow ? (
              // <p>target row goes here</p>
              <TableRow>
                {Object.keys(props.targetRow).map((k, index) => {
                  if (k !== 'x' && k !== 'y') {
                    if (k === 'cluster') {
                      return (
                        <TableCell align="left" key={index}>
                          {props.targetRow[k]}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell align="left" key={index}>
                        {props.targetRow[k]}
                      </TableCell>
                    );
                  }
                })}
                <TableCell
                  align="left"
                  onClick={() => props.handleTargetRowClicked(props.targetRow)}
                  style={{
                    color:
                      props.targetRow.cluster === 2 ? '#43AA8B' : '#D32F2F',
                    fontWeight: '500',
                  }}
                >
                  {props.targetRow.cluster === 2 ? 'true' : 'false'}
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    color:
                      props.targetRow.cluster === 2 ||
                      props.targetRow.cluster === 4
                        ? '#43AA8B'
                        : '#D32F2F',
                    fontWeight: '500',
                  }}
                >
                  {props.targetRow.cluster === 2 ||
                  props.targetRow.cluster === 4
                    ? 'true'
                    : 'false'}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {props.data.slice(1, props.data.length).map((row, index) => (
                  <TableRow key={index}>
                    {Object.keys(row).map((k, index) => {
                      if (k !== 'x' && k !== 'y') {
                        if (k === 'cluster') {
                          return (
                            <TableCell align="left" key={index}>
                              {row[k]}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell align="left" key={index}>
                            {row[k]}
                          </TableCell>
                        );
                      }
                    })}
                    <TableCell
                      align="left"
                      onClick={() => props.handleTableRowClicked(index)}
                      style={{
                        color: row.cluster === 2 ? '#43AA8B' : '#D32F2F',
                        fontWeight: '500',
                      }}
                    >
                      {row.cluster === 2 ? 'true' : 'false'}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        color:
                          row.cluster === 2 || row.cluster === 4
                            ? '#43AA8B'
                            : '#D32F2F',
                        fontWeight: '500',
                      }}
                    >
                      {row.cluster === 2 || row.cluster === 4
                        ? 'true'
                        : 'false'}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
