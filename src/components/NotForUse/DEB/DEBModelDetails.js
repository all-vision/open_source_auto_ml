/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import DATA from './model_details_data';
import Sidebar from '../Sidebar/Sidebar';
import ModelDetailsActions from './DEBModelDetailsActions';
import LoadingScreen from '../Shared/Loading';
import ChartAndMetricsWrapper from './ChartAndMetricsWrapper';
import DeployModelModal from './DeployModelModal';
// import AccessAPIModal from './DEBAccessAPIModal';
import DEBSlider from './DEBSlider';
import DEBTable from './DEBTable';
import DEBTooltip from './DEBTooltip';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import formatted_data from './formatted_data';
import '../../styles/ModelDetails/model-details-wrapper.css';

/* map redux store to props */
const mapStateToProps = (state) => {
  return {
    modelAssignedToDEB: state.modelAssignedToDEB, // model assigned to DEB Page
    selectedDataset: state.selectedDataset,
    sessionToken: state.auth_token,
    datasetId: state.datasetId,
  };
};

class ModelDetails extends Component {
  state = {
    model: null,
    originalData: [], // keep copy of original data before any manipulations are done on it
    data: [],
    options: null,
    clusters: null,
    targetRow: null,
    selectedCluster: '',
    selectedCluster: [],
    sliderValue: 90,
    timeSelectValue: 'this_week',
    activePage: 'deb',
    selectedYValue: '',
    selectedXValue: '',
    selectedXYValues: null,
    selectedYValueIsNull: false,
    selectedXValueIsNull: false,
    deployModelModalIsOpen: false,
    accessAPIModalIsOpen: false,
    showLoadingScreen: true,
    models: [
      {
        name: 'Original Chart',
        data: DATA,
        clusters: 8,
        silouette: 3,
        classifiesAnamolies: true,
        downsampledAmount: '230 (20%)',
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 1,
      },
      {
        name: 'HDBSCAN',
        data: DATA,
        clusters: 8,
        silouette: 14,
        classifiesAnamolies: false,
        downsampledAmount: '130 (15%)',
        recommendedByUs: true,
        classifiesAnamolies: true,
        newAnamolies: 5,
      },
      {
        name: 'DBSCAN',
        clusters: 7,
        silouette: 4,
        classifiesAnamolies: true,
        downsampledAmount: '430 (35%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 3,
      },
      {
        name: 'Tree Clustering 1',
        clusters: 8,
        silouette: 0.85,
        classifiesAnamolies: false,
        downsampledAmount: '330 (31%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 13,
      },
      {
        name: 'K Means',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Tree Clustering 2',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Isolation Forest',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Autoencoding',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Fuzzy Clustering',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Mean Shift',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Gaussian Mixture Models',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Birch',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Agglomerative',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Affinity Clustering',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Sting',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'Clique',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'SubCLue',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
      {
        name: 'HiCO',
        clusters: 8,
        silouette: 0.55,
        classifiesAnamolies: false,
        downsampledAmount: '130 (11%)',
        data: DATA,
        recommendedByUs: false,
        classifiesAnamolies: false,
        newAnamolies: 23,
      },
    ],
  };

  // function to allow user to assign a table row as emerging behavior or not
  handleTableRowClicked = (index) => {
    const data = this.state.data;
    const targetRow = data[index];
    if (targetRow.cluster === 2) {
      data[index].cluster = 1;
    } else {
      data[index].cluster = 2;
    }

    this.setState({
      data,
    });
  };

  // Reset Table data
  handleResetTableData = () => {
    this.setState({
      targetRow: null,
    });
  };

  handleTimeSelectChange = (e) => {
    const newTimeValue = e.target.value;

    // POST REQUEST SEND TIMESELECTVALUE
    // newTimeValue
    // GET REQUEST UPDATED DATA ?
    //
    this.setState({
      timeSelectValue: newTimeValue,
    });
  };

  // function to call API when user selects a new time via the slider
  handleSliderChangeComitted = () => {
    const currentSliderValue = this.state.sliderValue;
    // POST REQUEST HERE
    axios
      .get(`http://192.168.1.167:5001/getdataset/${currentSliderValue}`)
      .then((res) => this.setState({ data: res.data }));
  };

  // sets state when slider moves
  handleSliderChange = (event, value) => {
    const newSliderValue = value;
    this.setState({
      sliderValue: newSliderValue,
    });
  };

  // reset cluster chart to default values
  handleResetClusterData = () => {
    const originalData = this.state.originalData; 
    this.setState({
      data: originalData,
      selectedCluster: -1,
      targetRow: null,
      selectedYValue: null,
      selectedXValue: null,
      selectedXYValues: null,
    });
  };

  handleFilterDataByClusters = (event) => {
    // reset chart before doing anything else
    this.handleResetClusterData();

    // grab selected cluster number
    const selectedCluster = event.target.value;
    // if the select cluster is -1, return all clusters
    if (selectedCluster === -1) {
      return;
    }

    const existingData = this.state.originalData;
    // filter data based on cluster number
    const filteredData = existingData.filter(
      (d) => d.cluster === selectedCluster
    );

    // update data being passed to the chart with the new filtered data
    if (this.state.targetRow) {
    // reset the target row if it exists
      this.setState({
        data: filteredData,
        targetRow: null,
        selectedCluster: selectedCluster,
      });
    } else {
      this.setState({
        data: filteredData,
        selectedCluster: selectedCluster,
      });
    }
  };

  // update hyperparameters
  handleUpdateHyperparameter = (event, index) => {
    const newValue = event.target.value;
    const existingHyperparameters = this.state.hyperparameters;
    existingHyperparameters[index].value = newValue;

    this.setState({
      hyperparameters: existingHyperparameters,
    });
  };

  handleResetHyperparameters = () => {
    const defaultHyperparameters = this.state.defaultHyperparameters;
    this.setState({
      hyperparameters: defaultHyperparameters,
    });
  };

  // use this later
  handleSubmitHyperparameters = () => {
    const hyperparameters = this.state.hyperparameters;
  };

  // update elbow chart value
  handleUpdateSelectedHyperparameter = (event) => {
    const newSelectedHyperparameter = event.target.value;

    this.setState({
      elbowChartDropdownValue: newSelectedHyperparameter,
    });
  };

  handleGetData = (data) => {
    // format data so that the scatterplot will accept it
    // calls function from utils.js file
    // let formattedData = formatDataForScatterplot(data);
    let formattedData = formatDataForScatterplot(formatted_data);
    // create array of cluster numbers
    const clusters = formattedData.datasets.map((dataset) => dataset.label);

    const options = {
      // when user clicks on a dot in the scatterplot, filter data to only contain that point
      onClick: (e, element) => {
        if (element.length > 0) {
          const targetRow =
            formattedData.datasets[element[0]._datasetIndex].data[element[0]._index];
          this.setState({
            targetRow: targetRow,
          });
          window.scrollTo(0, document.body.scrollHeight);
        }
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            const toolTipItemIndex = tooltipItem[0].index;
            const keys = Object.keys(
              data.datasets[tooltipItem[0].datasetIndex].data[0]
            );
            const values = Object.values(
              data.datasets[tooltipItem[0].datasetIndex].data[toolTipItemIndex]
            );
            return keys.map((key, index) => {
              return `${key}: ${values[index]}`;
            });
          },
        },
        backgroundColor: '#323748',
        displayColors: false,
        mode: 'nearest',
        bodyFontFamily: 'Open Sans, Lato, Roboto',
      },
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 50,
          bottom: 50,
        },
      },
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            display: false,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            display: false,
            position: 'bottom',
          },
        ],
      },
    };

    this.setState({
      // data: data,
      // originalData: data,
      data: formatted_data,
      originalData: formatted_data,
      clusters: clusters,
      options: options,
    });
  };

  componentDidMount() {
    // if user has not selected a dataset, send them back to the datasets page
    if (!this.props.selectedDataset) {
      this.props.routeProps.history.push('/datasets');
      return;
    }

    this.handleGetData(formatted_data);
    let currentModels = this.state.models;
    let indexOfModel = 1;
    const targetModel = currentModels[indexOfModel];

    this.setState({
      model: targetModel,
    });

    setTimeout(() => {
      this.setState({
        showLoadingScreen: false,
      });
    }, 1500);
  }

  handleChangeXValue = (e) => {
    const newXValue = e.target.value;
    this.setState({
      selectedXValue: newXValue,
    });
  };

  handleChangeYValue = (e) => {
    const newYValue = e.target.value;
    this.setState({
      selectedYValue: newYValue,
    });
  };

  handleSubmitXYValues = () => {
    if (!this.state.selectedXValue && !this.state.selectedYValue) {
      this.setState({
        selectedXValueIsNull: true,
        selectedYValueIsNull: true,
      });
    }
    else if (!this.state.selectedXValue && this.state.selectedYValue) {
      this.setState({
        selectedXValueIsNull: true,
        selectedYValueIsNull: false,
      });
    }
    else if (!this.state.selectedYValue && this.state.selectedXValue) {
      this.setState({
        selectedYValueIsNull: true,
        selectedXValueIsNull: false,
      });
    }

    else {
      const newXYValues = {
        xValue: this.state.selectedXValue,
        yValue: this.state.selectedYValue,
      };
  
      let existingData = this.state.data;
      const originalData = this.state.originalData;
  
      let newData = [];
      existingData.forEach((d) => {
        let newObj = {
          ...d,
          x: d[newXYValues.xValue],
          y: d[newXYValues.yValue],
        };
        newData.push(newObj);
      });
  
      this.setState({
        selectedXYValues: newXYValues,
        data: newData,
        selectedYValueIsNull: false,
        selectedXValueIsNull: false,
      });
    }
  };

  handleOpenAccessAPIModal = () => {
    this.setState({
      accessAPIModalIsOpen: true,
      deployModelModalIsOpen: false,
    });
  };

  handleCloseAccessAPIModal = () => {
    this.setState({
      accessAPIModalIsOpen: false,
      deployModelModalIsOpen: false,
    });
  };

  handleOpenModal = () => {
    this.setState({
      deployModelModalIsOpen: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      deployModelModalIsOpen: false,
    });
  };

  componentDidUpdate(previousProps, previousState) {
    if (
      this.props.routeProps.match.params.id !==
      previousProps.routeProps.match.params.id
    ) {
      let currentModels = this.state.models;
      const indexOfModel = this.props.routeProps.match.params.id;
      const targetModel = currentModels[indexOfModel];
      this.setState({
        model: targetModel,
      });
    }
  }

  render() {
    if (this.state.showLoadingScreen) {
      return <LoadingScreen></LoadingScreen>;
    }
    return (
      <div
        className="sidebar-page-wrapper"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <Sidebar
          // model={this.state.model}
          models={this.state.models}
          activePage={this.state.activePage}
          routeProps={this.props.routeProps}
          selectedDataset={this.props.selectedDataset}
        ></Sidebar>
        <div className="model-detail-main-content">
          {/* <AccessAPIModal
            accessAPIModalIsOpen={this.state.accessAPIModalIsOpen}
            handleCloseAccessAPIModal={this.handleCloseAccessAPIModal}
          ></AccessAPIModal> */}
          <DeployModelModal
            deployModelModalIsOpen={this.state.deployModelModalIsOpen}
            model={this.state.model}
            handleCloseModal={this.handleCloseModal}
            handleOpenAccessAPIModal={this.handleOpenAccessAPIModal}
          ></DeployModelModal>
          <div className="model-detail-header">
            <h1>Detect Emerging Behaviors</h1>
            <h3>
              {/* Graph generated by UMAP, coloring determined by labels that were
              found. */}
              <b>{this.props.modelAssignedToDEB.name}</b> model used to generate clusters, coloring determined by labels that were found.
            </h3>
            <div className="model-detail-header-buttons-wrapper">
              <ModelDetailsActions
                model={this.state.model}
                data={this.state.data}
                selectedYValueIsNull={this.state.selectedYValueIsNull}
                selectedXValueIsNull={this.state.selectedXValueIsNull}
                clusters={this.state.clusters}
                selectedCluster={this.state.selectedCluster}
                selectedXValue={this.state.selectedXValue}
                selectedYValue={this.state.selectedYValue}
                handleUpdateData={this.handleUpdateData}
                handleResetData={this.handleResetData}
                handleResetClusterData={this.handleResetClusterData}
                handleOpenModal={this.handleOpenModal}
                handleChangeXValue={this.handleChangeXValue}
                handleChangeYValue={this.handleChangeYValue}
                handleSubmitXYValues={this.handleSubmitXYValues}
                handleFilterDataByClusters={this.handleFilterDataByClusters}
              ></ModelDetailsActions>
            </div>
          </div>
          <ChartAndMetricsWrapper
            model={this.state.model}
            data={this.state.data}
            options={this.state.options}
            timeSelectValue={this.state.timeSelectValue}
            handleTimeSelectChange={this.handleTimeSelectChange}
          ></ChartAndMetricsWrapper>
          <DEBSlider
            style={{ marginTop: '3vh' }}
            handleSliderChange={this.handleSliderChange}
            handleSliderChangeComitted={this.handleSliderChangeComitted}
            sliderValue={this.state.sliderValue}
          ></DEBSlider>
          <DEBTable
            style={{ marginTop: '10vh' }}
            data={this.state.data}
            targetRow={this.state.targetRow}
            handleResetTableData={this.handleResetTableData}
            handleTableRowClicked={this.handleTableRowClicked}
          ></DEBTable>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ModelDetails);
