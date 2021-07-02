/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MetricHyperparameterSelect from './MetricHyperparameterSelect';
import kmeans_types from '../HyperparameterTypes/kmeans_types';
import { FormHelperText } from '@material-ui/core';
import HyperparameterErrorAlert from './HyperparameterErrorAlert';
import hyperparameter_types from '../HyperparameterTypes/hyperparameter_types';
import '../../../styles/ModelDetails/HyperParameterAndElbow/hyperparameter-wrapper.css';

export default function HyperparametersWrapper(props) {
  const [arrayInputs, setArrayInputs] = useState([]);
  const [hyperparameters, setHyperparameters] = useState([]);
  const [hyperparameterTypes, setHyperparameterTypes] = useState([]);
  const [hyperparameterErrorInputs, setHyperparameterErrorInputs] = useState(
    []
  );

  const [hyperparameterErrorMessage, setHyperparameterErrorMessage] = useState(
    ''
  );

  useEffect(() => {
    if (props.model.OriginalModel) {
      let activeBaseModel = props.model.OriginalModel.trim().toLowerCase();
      const active_hyperparameter_types = hyperparameter_types[activeBaseModel];
      setHyperparameterTypes(active_hyperparameter_types);
    }

    setHyperparameters(props.modelHyperparameters);
  }, []);

  const handleResetHyperparameters = () => {
    setHyperparameterErrorInputs([]);
    // checkHyperparameterTypes(props.defaultHyperparameters);
    setHyperparameters(props.defaultHyperparameters);
  };

  // helper function to check if input is a float
  function isFloat(value) {
    if (!isNaN(value) && value.toString().indexOf('.') != -1) {
      return true;
    }
    return false;
  }

  const checkHyperparameterTypes = (hyperparameters) => {
    // gather all hyperparameters where the expected type is an integer
    const filteredByTypeInt = Object.keys(
      Object.fromEntries(
        Object.entries(hyperparameterTypes).filter(
          ([key, value]) => value === 'Int'
        )
      )
    );

    // gather all hyperparameters where the expected type is a float
    const filteredByTypeFloat = Object.keys(
      Object.fromEntries(
        Object.entries(hyperparameterTypes).filter(
          ([key, value]) => value === 'float'
        )
      )
    );

    const hyperparameterKeys = Object.keys(hyperparameters);

    // initialize array to keep track of errors in hyperparameters
    let errors = [];

    // check if inputted cluster amount is greater than or equal to 2000
    if (hyperparameters['n_clusters'] >= 2000) {
      errors.push('n_clusters');
      setHyperparameterErrorMessage('Cannot have more that 2000 clusters.');
    }
    hyperparameterKeys.forEach((key) => {
      if (!hyperparameters[key]) {
        return;
      }
      // make sure that hyperparameter has a positive value
      if (key === 'p') {
        if (hyperparameters[key] < 1) {
          setHyperparameterErrorMessage('P cannot be less than one.');
          errors.push(key);
        }
      }
      if (key === 'xi') {
        if (hyperparameters[key] <= 0 || hyperparameters[key] >= 1) {
          setHyperparameterErrorMessage('XI must be a float between 0 and 1');
          errors.push(key);
        }
      }
      if (hyperparameters[key] <= 0) {
        setHyperparameterErrorMessage(
          'Hyperparameters cannot be 0 or a negative number.'
        );
        errors.push(key);
      }
      // check if input is a float
      if (filteredByTypeFloat.includes(key) && !isFloat(hyperparameters[key])) {
        setHyperparameterErrorMessage('Mind your types!');
        errors.push(key);
      }

      // check if input is a whole number
      if (filteredByTypeInt.includes(key) && isFloat(hyperparameters[key])) {
        setHyperparameterErrorMessage('Mind your types!');
        errors.push(key);
      }
    });

    setHyperparameterErrorInputs(errors);
  };

  const handleUpdateHyperparameter = (event, param) => {
    const newValue = event.target.value;
    let existingHyperparameters = hyperparameters;
    let clone = Object.assign({}, existingHyperparameters);
    clone[param] = newValue;

    checkHyperparameterTypes(clone);

    setHyperparameters(clone);
  };

  useEffect(() => {
    const filteredByTypeArray = Object.fromEntries(
      Object.entries(hyperparameterTypes).filter(([key, value]) =>
        Array.isArray(value)
      )
    );
    setArrayInputs(filteredByTypeArray);
  }, [hyperparameterTypes]);

  if (!props) {
    return <p>loading things</p>;
  }

  return (
    <div className="hyperparams-wrapper">
      <div className="hyperparameters-header">
        <h1>{props.model.name} Hyperparameters</h1>
        {hyperparameterErrorInputs.length > 0 ? (
          <HyperparameterErrorAlert
            hyperparameterErrorMessage={hyperparameterErrorMessage}
          ></HyperparameterErrorAlert>
        ) : null}
      </div>
      <div className="hyperparameters-inputs-wrapper">
        {hyperparameters ? (
          Object.keys(hyperparameters).map((param, index) => {
            // check if parameter expected value is an array
            // if parameter type is an array render a dropdown menu
            if (Object.keys(arrayInputs).includes(param)) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <MetricHyperparameterSelect
                    handleUpdateHyperparameter={handleUpdateHyperparameter}
                    param={param}
                    dropdownValues={arrayInputs[param]}
                    // value={props.modelHyperparameters[param]}
                    value={hyperparameters[param]}
                    key={index}
                  />
                </div>
              );
            }
            // check is parameter value is type of float
            if (
              !isNaN(props.defaultHyperparameters[param]) &&
              props.defaultHyperparameters[param] &&
              props.defaultHyperparameters[param].toString().indexOf('.') != -1
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Float</FormHelperText>
                </div>
              );
            }
            if (
              !isNaN(props.defaultHyperparameters[param]) &&
              param.trim() === 'max_eps'
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Float</FormHelperText>
                </div>
              );
            }
            if (
              !isNaN(props.defaultHyperparameters[param]) &&
              param.trim() === 'p'
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Float</FormHelperText>
                </div>
              );
            }
            if (
              (!isNaN(props.defaultHyperparameters[param]) &&
                param.trim() === 'alpha') ||
              param.trim() === 'cluster_selection_epsilon'
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Float</FormHelperText>
                </div>
              );
            }
            // check if parameter expected value is a number
            if (
              !isNaN(
                props.defaultHyperparameters[param] &&
                  param.trim() !== 'max_eps'
              )
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Integer</FormHelperText>
                </div>
              );
            }

            // parameters expected value is a string
            return (
              <div className="hyperparameter-input" key={index}>
                <TextField
                  id="outlined-basic"
                  label={param}
                  type="text"
                  value={
                    hyperparameters[param] === '1e500'
                      ? 'Infinity'
                      : hyperparameters[param]
                  }
                  onChange={(e) => handleUpdateHyperparameter(e, param)}
                />
                <FormHelperText>Takes Text</FormHelperText>
              </div>
            );
          })
        ) : (
          <p>Loading hyperparameters</p>
        )}
      </div>
      <div className="hyperparameters-buttons-wrapper">
        <Button
          color="primary"
          variant="contained"
          className="hyperparameters-button run"
          disabled={hyperparameterErrorInputs.length > 0 ? true : false}
          onClick={() => props.handleOpenNewModelNameModal(hyperparameters)}
        >
          Update Hyperparameters
        </Button>
        <Button
          color="default"
          style={{ textTransform: 'capitalize' }}
          className="hyperparameters-button reset"
          // onClick={props.handleResetHyperparameters}
          onClick={handleResetHyperparameters}
        >
          Reset Hyperparameters
        </Button>
      </div>
    </div>
  );
}
