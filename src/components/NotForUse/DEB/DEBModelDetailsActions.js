/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LoadingScreen from '../Shared/Loading';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import '../../styles/ModelDetails/model-details-actions.css';

export default class ModelDetailsActions extends Component {
  state = {
    model: '',
    clusters: [],
    columnNames: [],
  };

  componentDidMount() {
    const constants = ['x', 'y', 'cluster'];
    let test = this.props.data[0];
    let keys = Object.keys(test);
    let columnNames = keys.filter((key) => !constants.includes(key));
    this.setState({
      columnNames: columnNames,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const constants = ['x', 'y', 'cluster'];
      let test = this.props.data[5];
      let keys = Object.keys(test);
      let values = Object.values(test);
      let columnNames = keys.filter((key) => !constants.includes(key) && this.props.data[5][key] == parseInt(this.props.data[5][key]));
      this.setState({
        columnNames: columnNames,
      });
    }
  }

  render() {
    return (
      <>
        <div className="model-details-actions-wrapper">
          <Button
            variant="contained"
            color="primary"
            className="deploy-model-api"
            onClick={this.props.handleOpenModal}
          >
            Deploy Model as API
          </Button>
          <Link
            to={'/unsupervised'}
            style={{
              color: '#1565C0',
              marginLeft: '1.25vw',
              fontFamily: 'Open Sans, Lato, Roboto',
              textDecoration: 'none',
              textDecorationColor: '#1565C0',
            }}
          >
            <Button
              style={{
                color: '#1565C0',
                fontFamily: 'Open Sans, Lato, Roboto',
                fontSize: '1rem',
                textTransform: 'capitalize',
                textDecoration: 'none',
                marginTop: '.25vh',
              }}
            >
              Compare clustering methods
            </Button>
          </Link>
          {/* <FormControl style={{ minWidth: 120 }} className="select-clusters">
            <InputLabel id="demo-simple-select-label">
              Select Clusters
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ overflowX: 'hidden' }}
              value={this.props.selectedCluster}
              onChange={this.props.handleFilterDataByClusters}
            >
              <MenuItem value={-1}>All Clusters</MenuItem>
              {this.props.clusters.map((cluster, index) => {
                return (
                  <MenuItem value={cluster} key={index}>
                    Cluster {cluster}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl> */}
          {/* <Button
            color="default"
            variant='outlined'
            className="reset-clusters-button"
            style={{ marginLeft: '2vw' }}
            onClick={this.props.handleResetClusterData}
          >
            Reset Chart
          </Button> */}
        </div>
        {/* new dropdowns added for demo */}
        <div style={{ marginTop: '3vh' }}>
          {/* <FormControl style={{ minWidth: 120 }} className="select-clusters">
            <InputLabel id="demo-simple-select-label">
              Select Clusters
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ overflowX: 'hidden' }}
              value={this.props.selectedCluster}
              multiple
              onChange={this.props.handleFilterDataByClusters}
            >
              <MenuItem value={-1}>All Clusters</MenuItem>
              {this.props.clusters.map((cluster, index) => {
                return (
                  <MenuItem value={cluster} key={index}>
                    Cluster {cluster}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl> */}
          <FormControl
            style={{ minWidth: 150 }}
            error={this.props.selectedXValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
              Select X Value
            </InputLabel>
            <Select
              // labelId="demo-simple-select-label"
              id="deb-select-x-value"
              style={{ overflowX: 'hidden' }}
              onChange={(e) => this.props.handleChangeXValue(e)}
              value={this.props.selectedXValue}
            >
              {/* <MenuItem value={'x'}>Original X Value</MenuItem>; */}
              {this.state.columnNames.map((column, index) => {
                return (
                  <MenuItem value={column} key={index}>
                    {column}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ minWidth: 150, marginLeft: '2vw' }}
            error={this.props.selectedYValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
              Select Y Value
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="deb-select-y-value"
              style={{ overflowX: 'hidden' }}
              value={this.props.selectedYValue}
              onChange={(e) => this.props.handleChangeYValue(e)}
            >
              {/* <MenuItem value={'y'}>Original Y Value</MenuItem>; */}
              {this.state.columnNames.map((column, index) => {
                return (
                  <MenuItem value={column} key={index}>
                    {column}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            style={{
              marginLeft: '1.5vw',
              color: '#1565C0',
              marginTop: '1.5vh',
              fontFamily: 'Open Sans, Lato, Roboto',
              textTransform: 'capitalize',
              fontSize: '.9rem',
            }}
            color="primary"
            onClick={this.props.handleSubmitXYValues}
          >
            Submit Changes
          </Button>
          <Tooltip title="Reset chart to default setting.">
            <Button
              style={{
                marginLeft: '1.5vw',
                marginTop: '1.5vh',
                fontFamily: 'Open Sans, Lato, Roboto',
                textTransform: 'capitalize',
                fontSize: '.9rem',
              }}
              color="default"
              // variant='outlined'
              onClick={this.props.handleResetClusterData}
            >
            Reset Chart
            </Button>
          </Tooltip>
        </div>
      </>
    );
  }
}
