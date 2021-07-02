/* eslint-disable react/prop-types */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import '../../styles/ModelDetails/new-model-being-created-screen.css';

const StyledButton = withStyles({
  root: {
    color: '#041425',
  },
})(CircularProgress);

/*
* screen that is rendered when a new model is being created
* is toggled in the ModelDetailsWrapper component
*/

export default function NewModeBeingCreatedScreen({modelHyperparameters}) {
  return (
    <section className='new-model-being-created-wrapper'>
      <div className='new-model-being-created-content'>
        <div className='new-model-being-created-content-header'>
          <h3>New Model Is Being Generated</h3>
          <StyledButton className='new-model-being-created-loader' />
        </div>
        <div className='new-model-being-created-receipt'>
          <h3>Updated Hyperparameters</h3>
          {Object.keys(modelHyperparameters).map((parameter, index) => {
            return (
              <div key={index} className='receipt-item'>
                <p className='receipt-item-key'>{parameter}: </p>
                <p className='receipt-item-value'>{modelHyperparameters[parameter]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}