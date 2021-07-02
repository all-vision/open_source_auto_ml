/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../../styles/Projects/projects-table.css';
import ProjectMenu from './ProjectMenu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable(props) {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ marginTop: '2vh' }}
        className="projects-table"
      >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Created By</TableCell>
              <TableCell align="right">Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.projects.map((row, index) => (
              <TableRow key={index} className="projects-table-row">
                <TableCell component="th" scope="row">
                  <Link to={`projects/${row.projectName}`}>
                    {row.projectName}
                  </Link>
                </TableCell>
                <TableCell align="right">{row.createdBy}</TableCell>
                <TableCell align="right">{row.lastUpdated}</TableCell>
                <TableCell align="right">
                  <ProjectMenu></ProjectMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
