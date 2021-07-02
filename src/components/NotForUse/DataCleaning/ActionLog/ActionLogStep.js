/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import '../../../styles/DataCleaning/ActionLog/action-log-step.css';

export default class ActionLogStep extends Component {
  render() {
    return (
      <div className="action-log-step-wrapper" style={{ marginTop: '1vh' }}>
        {this.props.actions[0].columnsToClean ? (
          <div style={{ width: '100%' }}>
            <div className="multiple-columns-selected">
              <p className="action-log-step-count">{this.props.index + 1}.</p>
              <p>
                {this.props.actions[0].action} (
                {this.props.actions[0].columnsToClean.length})
              </p>
              <CloseIcon
                onClick={() => this.props.handleDeleteAction(this.props.index)}
                fontSize={'small'}
                className="action-log-close-icon"
              />
            </div>
            <div className="action-log-selected-columns-wrapper">
              {this.props.actions[0].columnsToClean.map((col, index) => {
                return (
                  <>
                    <p key={index}>{col.columnName},</p>
                  </>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <p className="action-log-step-count">{this.props.index + 1}.</p>
            {this.props.actions[0].labelIndex == -1 ? (
              <p>no label selected</p>
            ) : (
              <p>
                <span className="set-span">Set</span>column{' '}
                <span className="column-span">
                  {
                    this.props.columnsToTrack[this.props.actions[0].labelIndex]
                      .columnName
                  }
                </span>{' '}
                as <span className="label-span">Label</span>
              </p>
            )}

            <CloseIcon
              onClick={() => this.props.handleDeleteAction(this.props.index)}
              fontSize={'small'}
              className="action-log-close-icon"
            />
          </>
        )}
      </div>
    );
  }
}
