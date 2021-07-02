/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import AdminPageTableMenu from './AdminPageTableMenu';
import DestroyModelModal from './DestroyModelModal';
import AccessAPIModal from './AccessAPIModal';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#f5f5f5',
    color: '#323748',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    width: '85%',
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();

  return (
    <>
      <AccessAPIModal
        accessAPIModalIsOpen={props.accessAPIModalIsOpen}
        handleCloseAPIAcessModal={props.handleCloseAPIAcessModal}
        modelAPIToAccess={props.modelAPIToAccess}
      />
      <DestroyModelModal
        modelToDestroy={props.modelToDestroy}
        destroyModelIsOpen={props.destroyModelIsOpen}
        handleModalClose={props.handleModalClose}
        destroy={props.destroy}
      />
      <TableContainer
        component={Paper}
        style={{ width: '95%', marginTop: '3vh' }}
      >
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Model Name</StyledTableCell>
              <StyledTableCell align="left">Dataset</StyledTableCell>
              <StyledTableCell align="left">State</StyledTableCell>
              <StyledTableCell align="left">Age</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.deployed_models.map((model, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="left">
                  {model.modelName}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {model.dataset}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Chip
                    label={model.modelIsDeployed ? 'Deployed' : 'Not Deployed'}
                    style={{
                      background: model.modelIsDeployed ? '#43AA8B' : '#d32f2f',
                      color: '#fff',
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">{model.deployedDate}</StyledTableCell>
                <StyledTableCell align="right">
                  <AdminPageTableMenu
                    model={model}
                    handleModalOpen={props.handleModalOpen}
                    handleOpenAPIAcessModal={props.handleOpenAPIAcessModal}
                    handleDestroyModel={props.handleDestroyModel}
                    handleStopModel={props.handleStopModel}
                    index={index}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
