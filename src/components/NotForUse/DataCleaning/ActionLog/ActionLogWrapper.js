/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import '../../../styles/DataCleaning/ActionLog/action-log-wrapper.css';
import ActionLogAddNewStepModal from './ActionLogAddNewStepModal';
import ActionLogStep from './ActionLogStep';
import { Link } from 'react-router-dom';

export default class ActionLogWrapper extends Component {
  state = {
    columnsToTrack: [],
    action: 'none',
    labelIndex: -1,
    actions: [],
  };

  componentDidMount() {
    const columnsToTrack = [];
    this.props.columns.forEach((column) => {
      columnsToTrack.push({
        columnName: column,
        checked: false,
      });
    });
    this.setState({
      columnsToTrack: columnsToTrack,
      labelIndex: this.props.labelIndex,
    });
  }

  resetAddNewStepModal = () => {
    const columnsToTrack = [];
    this.props.columns.forEach((column) => {
      columnsToTrack.push({
        columnName: column,
        checked: false,
      });
    });
    this.setState({
      columnsToTrack: columnsToTrack,
      action: 'none',
      labelIndex: '',
    });
  };

  handleDeleteAction = (e) => {
    const targetActionIndex = e;
    const currentActions = this.state.actions;

    if (targetActionIndex > -1) {
      currentActions.splice(targetActionIndex, 1);
    }

    this.setState({
      actions: currentActions,
    });
  };

  handleResetAction = () => {
    this.setState({
      actions: [],
    });
  };

  handleSaveAction = () => {
    let newAction = [];
    const action = this.state.action;
    const columnsToClean = this.state.columnsToTrack.filter(
      (col) => col.checked === true
    );
    const labelIndex = this.props.labelIndex;

    if (action === 'select_label') {
      newAction.push({
        action: action,
        labelIndex: labelIndex,
      });
    } else {
      newAction.push({
        action: action,
        columnsToClean: columnsToClean,
      });
    }

    this.setState((prevState) => ({
      actions: [...prevState.actions, newAction],
    }));

    this.props.handleModalClose();
    this.resetAddNewStepModal();
  };

  handleSetAction = (e) => {
    const action = e.target.value;
    this.setState({
      action: action,
    });
  };

  handleCheckForCombine = (e) => {
    let columns = this.state.columnsToTrack;
    columns.forEach((col) => {
      if (col.columnName === e.target.name) {
        col.checked = !col.checked;
      }
    });
    this.setState({
      columnsToTrack: columns,
    });
  };

  render() {
    if (!this.state.columnsToTrack.length > 0) {
      return <div>loading</div>;
    } else {
      return (
        <div className="action-log-wrapper">
          <ActionLogAddNewStepModal
            handleModalClose={this.props.handleModalClose}
            addNewStepModalIsOpen={this.props.addNewStepModalIsOpen}
            columns={this.state.columnsToTrack}
            handleCheckForCombine={this.handleCheckForCombine}
            handleSetAction={this.handleSetAction}
            options={this.props.columns}
            labelIndex={this.props.labelIndex}
            handleLabelUpdate={this.props.handleLabelUpdate}
            action={this.state.action}
            handleSaveAction={this.handleSaveAction}
          ></ActionLogAddNewStepModal>
          <div className="action-log-header">
            <Button
              variant="contained"
              color="primary"
              className="add-new-step-button action-log-header-item"
              onClick={this.props.handleModalOpen}
            >
              New Step
            </Button>
            <h3 className="action-log-header-item">Actions Log</h3>
            <RefreshIcon
              className="action-log-refresh"
              onClick={this.handleResetAction}
            ></RefreshIcon>
          </div>
          <div className="action-log-steps-wrapper">
            {this.state.actions.map((action, index) => {
              return (
                <ActionLogStep
                  actions={action}
                  index={index}
                  key={index}
                  columnsToTrack={this.state.columnsToTrack}
                  handleDeleteAction={this.handleDeleteAction}
                ></ActionLogStep>
              );
            })}
          </div>
          <Link to="/summary" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              className="action-log-execute-actions-button"
            >
              execute actions
            </Button>
          </Link>
        </div>
      );
    }
  }
}
