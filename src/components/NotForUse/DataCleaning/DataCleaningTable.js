/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable(props) {
  const classes = useStyles();
  const [data, setData] = useState(props.data);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {
                props.labelIndex !== -1 
                  ? 
                  <TableCell style={{border: '5px solid red'}}>{data[0][props.labelIndex]}(label)<ExpandMoreIcon></ExpandMoreIcon></TableCell>
                  : null
              }
              {
                data[0].map((customer, index) => {
                  if (data[0].indexOf(customer) !== props.labelIndex) {
                    return <TableCell align="left" key={index}>{customer}<ExpandMoreIcon></ExpandMoreIcon></TableCell>;
                  }
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(1, 10).map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row[0]}
                </TableCell>
                <TableCell align="left">{row[1]}</TableCell>
                <TableCell align="left">{row[2]}</TableCell>
                <TableCell align="left">{row[3]}</TableCell>
                <TableCell align="left">{row[4]}</TableCell>
                <TableCell align="left">{row[5]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
