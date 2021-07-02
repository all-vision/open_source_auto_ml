/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LoadingScreen from '../Shared/Loading';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import color_palette from '../Shared/ColorPalette';
import '../../styles/ModelDetails/model-details-actions.css';

const StyledSwitch = withStyles({
  switchBase: {
    color: '#eee',
    '&$checked': {
      color: '#1565C0',
    },
    '&$checked + $track': {
      backgroundColor: '#C3C5C8',
    },
  },
  checked: {},
  track: {
    background: 'rgba(50,55,73,.8)',
    '&$checked': {
      background: '#1565C0',
    },
  },
})(Switch);

/*
* component to hold all of the actions items
* filter by cluster, select x,y coordinates, reset data, submit values, toggle tooltip
*/

export default class ModelDetailsActions extends Component {
  state = {
    model: '',
    clusters: [],
    selectedXValue: '',
    selectedYValue: '',
    columnNames: [],
  };

  componentDidMount() {
    const constants = ['x', 'y', 'cluster'];
    let test = this.props.data[0];
    let keys = Object.keys(test);
    let columnNames = keys.filter((key) => !constants.includes(key));
    let integerOnlyColumnNames = [];
    columnNames.forEach((column) => {
      if (!isNaN(this.props.data[1][column]) && this.props.data[1][column]) {
        integerOnlyColumnNames.push(column);
      }
    }); 
    this.setState({
      columnNames: integerOnlyColumnNames,
      model: this.props.model,
    });
  }

  handleResetData = () => {
    this.props.handleResetClusterData();
    this.setState({
      selectedXValue: '',
      selectedYValue: ''
    });
  }
  render() {
    if (!this.state.model) {
      return <LoadingScreen></LoadingScreen>;
    }
    return (
      <>
        <div className="model-details-actions-wrapper">
          <FormControl
            style={{ maxWidth: 200, minWidth: 200 }}
          >
            <InputLabel id="demo-simple-select-label">
                Filter Data By Cluster
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              multiple
              style={{ overflowX: 'hidden' }}
              onChange={(e) => this.props.handleFilterDataByCluster(e)}
              value={this.props.selectedClusters}
            >
              <MenuItem value={'All Clusters'}>All Clusters</MenuItem>
              {this.props.clusters.map((cluster, index) => {
                if (cluster === -1) {
                  return (
                    <MenuItem value={cluster} key={index} style={{color: '#ADADAD'}}> 
                      {`${cluster} (Anomaly)`}
                    </MenuItem>
                  );
                }
                return (
                  <MenuItem 
                    value={cluster} 
                    key={index}
                    style={{
                      color: color_palette[cluster],
                      fontWeight: 'bold',
                      fontFamily: 'Open Sans, Lato, Roboto'
                    }}
                  >
                    {cluster}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ minWidth: 150, marginLeft: '2vw' }}
            error={this.props.selectedXValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
              Select X Value
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ overflowX: 'hidden' }}
              onChange={(e) => this.setState({selectedXValue: e.target.value})}
              value={this.state.selectedXValue}
            >
              {this.state.columnNames.map((column, index) => {
                return (
                  <MenuItem value={column} key={index}>
                    {this.props.data[0][column]}
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
              id="demo-simple-select"
              style={{ overflowX: 'hidden' }}
              value={this.state.selectedYValue}
              onChange={(e) => this.setState({selectedYValue: e.target.value})}
            >
              {this.state.columnNames.map((column, index) => {
                return (
                  <MenuItem value={column} key={index}>
                    {this.props.data[0][column]}
                  </MenuItem>
                );
              })}
            </Select>
            {/* </Tooltip> */}
          </FormControl>
          <Button
            style={{
              marginLeft: '1.5vw',
              marginTop: '1.5vh',
              color: '#fafafa',
              background: '#1565C0',
              fontFamily: 'Open Sans, Lato, Roboto',
              textTransform: 'capitalize',
              fontSize: '.9rem',
            }}
            variant="contained"
            color="primary"
            onClick={() => this.props.handleSubmitXYValues(this.state.selectedYValue, this.state.selectedXValue)}
          >
            Submit Changes
          </Button>
          <Button
            style={{
              marginLeft: '1vw',
              marginTop: '1.5vh',
              fontSize: '.9rem',
            }}
            color="default"
            className="reset-clusters-button"
            onClick={this.handleResetData}
          >
              Reset Chart
          </Button>
          <FormControlLabel
            checked={this.props.enableScatterplotTooltip}
            onChange={this.props.handleToggleToolTip}
            className='toggle-tooltip-switch'
            control={<StyledSwitch color='primary' />}
            label="Enable Tooltip"
            labelPlacement="right"
          />
        </div>
      </>
    );
  }
}
