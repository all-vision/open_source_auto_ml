/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AdminPageChart from './AdminPageChart';
import AdminPageUsage from './AdminPageUsage';
import AdminPageTable from './AdminPageTable';
import AdminPageTableMenu from './AdminPageTableMenu';
import { connect } from 'react-redux';
import AdminPageTimeSelect from './AdminPageTimeSelect';
import { deployed_models } from './mock_deployed_models';
import { formatDataForLineChart } from './AdminUtils';
import '../../styles/AdminPage/admin-page.css';

const mapStateToProps = (state) => {
  return {
    // selectedDataset: state.selectedDataset,
    sessionToken: state.auth_token
  };
};

class AdminPage extends Component {
  state = {
    activePage: 'admin',
    destroyModelIsOpen: false,
    accessAPIModalIsOpen: false,
    selectedTimeRange: 'today',
    options: [],
    modelToDestroy: '',
    modelAPIToAccess: '',
    deployed_models: [],
    models: [
      {
        name: 'Original Chart',
        data: [1, 2, 3],
        recommendedByUs: false,
        classifiesAnamolies: false,
      },
      {
        name: 'DB Scan',
        data: [1, 2, 3],
        recommendedByUs: true,
        classifiesAnamolies: true,
      },
      {
        name: 'Tree Cluster #1',
        data: [1, 2, 3],
        recommendedByUs: false,
        classifiesAnamolies: false,
      },
      {
        name: 'Random Forest',
        data: [1, 2, 3],
        recommendedByUs: false,
        classifiesAnamolies: false,
      },
      {
        name: 'Tree Cluster #5',
        data: [1, 2, 3],
        recommendedByUs: false,
        classifiesAnamolies: false,
      },
    ],
    deployedModels: [
      {
        modelName: 'DB Scan',
        dataset: 'titanic_data.csv',
        deployed: true,
        age: '12d',
        actions: <AdminPageTableMenu></AdminPageTableMenu>,
      },
      {
        modelName: 'Tree Cluster',
        dataset: 'fraud.csv',
        deployed: true,
        age: '30d',
        actions: <AdminPageTableMenu></AdminPageTableMenu>,
      },
      {
        modelName: 'Random Forest',
        dataset: 'airbnb.csv',
        deployed: true,
        age: '41d',
        actions: <AdminPageTableMenu></AdminPageTableMenu>,
      },
    ],
  };

  componentDidMount() {
    // check that a selected dataset exists, if not send user back to datasets page
    if (!this.props.selectedDataset) {
      this.props.routeProps.history.push('/datasets');
      return;
    }
  }

  handleUpdateSelectedTimeRange = (e) => {
    const updatedTimeRange = e.target.value;
    let options = {
      legend: {
        display: true,
      },
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 20,
          bottom: 0,
        },
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 100,
            borderColor: '#DB504A',
            borderWidth: 2,
            label: {
              enabled: true,
              fontFamily: 'Nunito',
              backgroundColor: 'rgba(0,0,0,.7)',
              content: 'Limit',
            },
          },
        ],
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'MB Usage',
            },
            gridLines: {
              color: 'rgba(238,238,238, .4)',
            },
            ticks: {
              beginAtZero: true,
              suggestedMax: 120,
              stepSize: 10,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              gridLines: {
                display: false,
              },
              labelString: updatedTimeRange,
            },
          },
          {
            display: false,
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };
    let deployedModels = formatDataForLineChart(
      updatedTimeRange,
      deployed_models
    );
    this.setState({
      options: options,
      deployed_models: deployedModels,
    });
  };

  // destroys model
  destroy = (model) => {
    const deployedModels = this.state.deployedModels;
    const targetModel = model.modelName;
    const filteredModels = deployedModels.filter(
      (model) => model.modelName !== targetModel
    );

    this.setState({
      deployedModels: filteredModels,
    });

    this.handleModalClose();
  };

  // opens destroy model modal
  handleDestroyModel = (index) => {
    const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    this.setState({
      modelToDestroy: targetModel,
    });

    this.handleModalOpen();
  };

  handleOpenAPIAcessModal = (index) => {
    const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    this.setState({
      accessAPIModalIsOpen: true,
      modelAPIToAccess: targetModel,
    });
  };

  handleCloseAPIAcessModal = () => {
    this.setState({
      accessAPIModalIsOpen: false,
    });
  };

  handleModalOpen = () => {
    this.setState({
      destroyModelIsOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      destroyModelIsOpen: false,
    });
  };

  handleStopModel = (action, index) => {
    const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    targetModel.deployed = !targetModel.deployed;

    const targetModelIsDeployed = targetModel.deployed;

    if (!targetModelIsDeployed) {
      this.setState((prevState) => {
        const newItems = [...prevState.deployedModels];
        newItems[index].deployed = false;
        return { deployedModels: newItems };
      });
    } else {
      this.setState((prevState) => {
        const newItems = [...prevState.deployedModels];
        newItems[index].deployed = true;
        return { deployedModels: newItems };
      });
    }
  };

  componentDidMount() {
    // check that a selected dataset exists, if not send user back to datasets page
    if (!this.props.selectedDataset) {
      this.props.routeProps.history.push('/datasets');
      return;
    }

    let options = {
      legend: {
        display: true,
      },
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 20,
          bottom: 15,
        },
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 100,
            borderColor: '#DB504A',
            borderWidth: 2,
            label: {
              enabled: true,
              fontFamily: 'Nunito',
              backgroundColor: 'rgba(0,0,0,.7)',
              content: 'Limit',
            },
          },
        ],
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'MB Usage',
            },
            gridLines: {
              color: 'rgba(238,238,238, .4)',
            },
            ticks: {
              beginAtZero: true,
              suggestedMax: 120,
              stepSize: 10,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              gridLines: {
                display: false,
              },
              labelString: 'Today',
            },
          },
          {
            display: false,
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };
    let deployedModels = formatDataForLineChart(
      this.state.selectedTimeRange,
      deployed_models
    );
    this.setState({
      options: options,
      deployed_models: deployedModels,
    });
  }
  render() {
    return (
      <div className="sidebar-page-wrapper">
        <Sidebar
          activePage={this.state.activePage}
          models={this.state.models}
          selectedDataset={this.props.selectedDataset}
          routeProps={this.props.routeProps}
        ></Sidebar>
        <div className="admin-page-main-content">
          <div className="admin-page-header">
            <h1>Your Deployed Models</h1>
            <h3>View your usage analytics, and deployed models</h3>
          </div>
          <div className="daily-data-header">
            <h1>Usage per Model in MB's</h1>
            <AdminPageTimeSelect
              className="admin-page-time-select"
              handleUpdateSelectedTimeRange={this.handleUpdateSelectedTimeRange}
              selectedTimeRange={this.state.selectedTimeRange}
            ></AdminPageTimeSelect>
          </div>

          <div className="admin-page-analytics-wrapper">
            <div className="admin-page-chart-wrapper">
              <AdminPageChart
                selectedTimeRange={this.state.selectedTimeRange}
                options={this.state.options}
                deployed_models={this.state.deployed_models}
              ></AdminPageChart>
            </div>
            <div className="admin-page-usage-wrapper">
              <AdminPageUsage deployed_models={deployed_models}></AdminPageUsage>
            </div>
          </div>
          <div className="deployed-models-wrapper">
            <h1>Deployed Models</h1>
            {this.state.deployedModels.length > 0 ? (
              <AdminPageTable
                destroyModelIsOpen={this.state.destroyModelIsOpen}
                accessAPIModalIsOpen={this.state.accessAPIModalIsOpen}
                deployedModels={this.state.deployedModels}
                deployed_models={deployed_models}
                modelToDestroy={this.state.modelToDestroy}
                modelAPIToAccess={this.state.modelAPIToAccess}
                handleStopModel={this.handleStopModel}
                handleModalOpen={this.handleModalOpen}
                handleModalClose={this.handleModalClose}
                handleOpenAPIAcessModal={this.handleOpenAPIAcessModal}
                handleCloseAPIAcessModal={this.handleCloseAPIAcessModal}
                handleDestroyModel={this.handleDestroyModel}
                destroy={this.destroy}
              ></AdminPageTable>
            ) : (
              <p>You have no deployed models</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AdminPage);
