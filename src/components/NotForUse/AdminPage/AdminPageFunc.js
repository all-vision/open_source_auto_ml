import React, { Component, useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AdminPageChart from './AdminPageChart';
import AdminPageUsage from './AdminPageUsage';
import AdminPageTable from './AdminPageTable';
import AdminPageTableMenu from './AdminPageTableMenu';
import { connect } from 'react-redux';
import AdminPageTimeSelect from './AdminPageTimeSelect';
import { deployed_models } from './mock_deployed_models';
import { formatDataForLineChart } from './AdminUtils';
import PropTypes from 'prop-types';
import models from '../DEB/models';
import axios from 'axios';
import '../../styles/AdminPage/admin-page.css';

const mapStateToProps = (state) => {
  return {
    selectedDataset: state.selectedDataset,
    auth_token: state.auth_token,
    // sessionToken: state.auth_token
  };
};

function AdminPageFunc(props) {
  const [activePage, setActivePage] = useState('admin');
  const [destroyModelIsOpen, setDestroyModelIsOpen] = useState(false);
  const [accessAPIModalIsOpen, setAccessAPIModalIsOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [options, setOptions] = useState([]);
  const [modelToDestroy, setModelToDestroy] = useState('');
  const [modelAPIToAccess, setModelAPIToAccess] = useState('');
  const [dep_models, setDeployed_models] = useState([]);
  const [deployedModels, setDeployedModels] = useState(
    [
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
    ]
  );
  /*
state = {
    activePage: 'admin',
    destroyModelIsOpen: false,
    accessAPIModalIsOpen: false,
    selectedTimeRange: 'today',
    options: [],
    modelToDestroy: '',
    modelAPIToAccess: '',
    deployed_models: [],
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
    */
  const handleUpdateSelectedTimeRange = (e) => {
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
              fontFamily: 'Open Sans',
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
    setOptions(options);
    setDeployed_models(deployedModels);
    // this.setState({
    //   options: options,
    //   deployed_models: deployedModels,
    // });
  };

  // destroys model
  const destroy = (model) => {
    // const deployedModels = this.state.deployedModels;
    const targetModel = model.modelName;
    const filteredModels = deployedModels.filter(
      (model) => model.modelName !== targetModel
    );
    setDeployedModels(filteredModels);
    // this.setState({
    //   deployedModels: filteredModels,
    // });

    handleModalClose();
  };

  // opens destroy model modal
  const handleDestroyModel = (index) => {
    // const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    setModelToDestroy(targetModel);
    // this.setState({
    //   modelToDestroy: targetModel,
    // });

    handleModalOpen();
  };

  const handleOpenAPIAcessModal = (index) => {
    // const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    setAccessAPIModalIsOpen(true);
    setModelAPIToAccess(targetModel);
    // this.setState({
    //   accessAPIModalIsOpen: true,
    //   modelAPIToAccess: targetModel,
    // });
  };

  const handleCloseAPIAcessModal = () => {
    setAccessAPIModalIsOpen(false);
    // this.setState({
    //   accessAPIModalIsOpen: false,
    // });
  };

  const handleModalOpen = () => {
    setDestroyModelIsOpen(true);
    // this.setState({
    //   destroyModelIsOpen: true,
    // });
  };

  const handleModalClose = () => {
    setDestroyModelIsOpen(false);
    // this.setState({
    //   destroyModelIsOpen: false,
    // });
  };

  const handleStopModel = (action, index) => {
    // const deployedModels = this.state.deployedModels;
    let targetModel = deployedModels[index];
    targetModel.deployed = !targetModel.deployed;

    const targetModelIsDeployed = targetModel.deployed;

    if (!targetModelIsDeployed) {
      const newItems = [...deployedModels];
      newItems[index].deployed = false;
      setDeployedModels(newItems);
    } else {
      const newItems = [...deployedModels];
      newItems[index].deployed = true;
      setDeployedModels(newItems);
    }
    // if (!targetModelIsDeployed) {
    //   this.setState((prevState) => {
    //     const newItems = [...prevState.deployedModels];
    //     newItems[index].deployed = false;
    //     return { deployedModels: newItems };
    //   });
    // } else {
    //   this.setState((prevState) => {
    //     const newItems = [...prevState.deployedModels];
    //     newItems[index].deployed = true;
    //     return { deployedModels: newItems };
    //   });
    // }
  };

  const handleAuthenticationResult = (res) => {
    const message = res.data.message;
    if (message === 'Invalid session token.') {
      alert('FAILURE');
      props.routeProps.history.push('/notauthorized');
      // redirect to page here
      return;
    }
  };

  useEffect(() => {
    // check that a selected dataset exists, if not send user back to datasets page
    if (!props.selectedDataset) {
      props.routeProps.history.push('/datasets');
      return;
    }
  
    const auth_token = props.auth_token.SessionToken;
    const config = {
      headers: { Authorization: `Bearer ${auth_token}` }
    };
  
    const bodyParameters = {
      key: 'value'
    };
  
    axios.post( 
      'https://govoracle.azurewebsites.net/check-token',
      // 'https://allvisionflask.azurewebsites.net/check-token', - Original
      bodyParameters,
      config
    )
      .then((res) => {
        handleAuthenticationResult(res);
      })
      .catch((error) => handleAuthenticationFailed(error));

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
              fontFamily: 'Open Sans',
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
      selectedTimeRange,
      deployed_models
    );
    setOptions(options);
    setDeployed_models(deployedModels);
    // this.setState({
    //   options: options,
    //   deployed_models: deployedModels,
    // });
  }, []);

  if (deployed_models) {
    return (
      <div
        className="sidebar-page-wrapper"
        style={{ display: 'flex', flexDirection: 'row', border: '1px red solid'}}
      >
        <Sidebar
          activePage={activePage}
          models={models}
          selectedDataset={props.selectedDataset}
          routeProps={props.routeProps}
        ></Sidebar>
        <div
          className="admin-page-main-content"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div className="admin-page-header">
            <h1>Your Deployed Models</h1>
            <h3>View your usage analytics, and deployed models</h3>
          </div>
          <div className="daily-data-header">
            <h1>Usage per Model in MB&apos;s</h1>
            <AdminPageTimeSelect
              className="admin-page-time-select"
              handleUpdateSelectedTimeRange={handleUpdateSelectedTimeRange}
              selectedTimeRange={selectedTimeRange}
            ></AdminPageTimeSelect>
          </div>
  
          <div className="admin-page-analytics-wrapper">
            <div className="admin-page-chart-wrapper">
              <AdminPageChart
                selectedTimeRange={selectedTimeRange}
                options={options}
                deployed_models={dep_models}
              ></AdminPageChart>
            </div>
            <div className="admin-page-usage-wrapper">
              <AdminPageUsage deployed_models={deployed_models}></AdminPageUsage>
            </div>
          </div>
          <div className="deployed-models-wrapper">
            <h1>Deployed Models</h1>
            {deployedModels.length > 0 ? (
              <AdminPageTable
                destroyModelIsOpen={destroyModelIsOpen}
                accessAPIModalIsOpen={accessAPIModalIsOpen}
                deployedModels={deployedModels}
                deployed_models={deployed_models}
                modelToDestroy={modelToDestroy}
                modelAPIToAccess={modelAPIToAccess}
                handleStopModel={handleStopModel}
                handleModalOpen={handleModalOpen}
                handleModalClose={handleModalClose}
                handleOpenAPIAcessModal={handleOpenAPIAcessModal}
                handleCloseAPIAcessModal={handleCloseAPIAcessModal}
                handleDestroyModel={handleDestroyModel}
                destroy={destroy}
              ></AdminPageTable>
            ) : (
              <p>You have no deployed models</p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <p>loading</p>
    );
  }

}

// export default connect(mapStateToProps)(AdminPageFunc);
export default connect(mapStateToProps)(AdminPageFunc);

AdminPageFunc.propTypes = {
  clearDatasets: PropTypes.func,
  addDataset: PropTypes.func,
  routeProps: PropTypes.object,
  selectedDataset: PropTypes.object
};
  