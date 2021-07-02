/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import DATA from './model_details_data';
import Sidebar from '../Sidebar/Sidebar';
import ModelDetailsActions from './DEBModelDetailsActions';
import LoadingScreen from '../Shared/Loading';
import DeployModelModal from './DeployModelModal';
// import AccessAPIModal from './DEBAccessAPIModal';
import DEBModelDetailsModal from './DEBModelDetailsModal';
import { connect } from 'react-redux';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import {
  assignModelToDEB,
  setActiveDatasetData,
  setOriginalChartData,
} from '../../redux/actions/index';
import { useQuery, useSubscription, gql } from '@apollo/client';
import Highcharts from './Highcharts';
import ReactVirtualizedGrid from './ReactVirtualizedGrid';
import Skeleton from '@material-ui/lab/Skeleton';
import '../../styles/ModelDetails/model-details-wrapper.css';

const mapStateToProps = (state) => {
  return {
    modelAssignedToDEB: state.modelAssignedToDEB, // model assigned to DEB Page
    selectedDataset: state.selectedDataset,
    sessionToken: state.auth_token,
    auth_token: state.auth_token,
    datasetId: state.datasetId,
    activeDatasetData: state.activeDatasetData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    assignModelToDEB: (model) => dispatch(assignModelToDEB(model)),
    setActiveDatasetData: (data) => dispatch(setActiveDatasetData(data)),
    setOriginalChartData: (data) => dispatch(setOriginalChartData(data)),
  };
};

const GET_COORDS = gql`
  {
    testData {
      format1
      format3
      format2
    }
  }
`;

const GET_CLUSTERING_COLUMN = gql`
  query($DatasetID: _uuid) {
    ModelsTable(where: { DatasetID: { _eq: $DatasetID } }) {
      ClusteringColumn
    }
  }
`;

const GET_COORDINATES = gql`
  query($DatasetIDRef: uuid) {
    DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
      Coordinates
    }
  }
`;

function DEBModelDetailsFunc(props) {
  const [model, setModel] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [targetRow, setTargetRow] = useState(null);
  //   const [selectedCluster, setSelectedCluster] = useState('')
  const [selectedCluster, setSelectedCluster] = useState([]);
  const [sliderValue, setSliderValue] = useState(90);
  const [timeSelectValue, setTimeSelectValue] = useState('this_week');
  const [activePage, setActivePage] = useState('deb');
  const [selectedXValue, setSelectedXValue] = useState('');
  const [selectedYValue, setSelectedYValue] = useState('');
  const [selectedXYValues, setSelectedXYValues] = useState(null);
  const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  const [deployModelModalIsOpen, setDeployModelModalIsOpen] = useState(false);
  const [accessAPIModalIsOpen, setAccessAPIModalIsOpen] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [hyperparameters, setHyperparameters] = useState([]);
  const [modelDetailsModalIsOpen, setModelDetailsModalIsOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [originalChartData, setOriginalChartData] = useState([]);
  const [chartClusters, setChartClusters] = useState([]);
  const [finalChartData, setFinalChartData] = useState([]);
  const [isRendered, setIsRendered] = useState(false);
  const [models, setModels] = useState([
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
  ]);

  let coordinates;
  if (props.selectedDataset) {
    coordinates = useQuery(GET_COORDINATES, {
      variables: { DatasetIDRef: props.selectedDataset.DatasetIDRef },
    });
  }

  const coords = useQuery(GET_COORDS);

  let newString;
  if (props.selectedDataset) {
    newString = '{' + props.selectedDataset.DatasetIDRef + '}';
  }

  const clusteringColumnData = useQuery(GET_CLUSTERING_COLUMN, {
    variables: { DatasetID: newString },
  });

  // if (clusteringColumnData.data) {
  //   console.log('clusteringColumnData: ', clusteringColumnData);
  // }
  if (coords.data) {
    // console.log('coords.data: ', coords);
  }

  if (coordinates.data) {
    let coordinatesData = coordinates.data;
  }

  useEffect(() => {
    if (!clusteringColumnData.loading) {
      let clusterColumns =
        clusteringColumnData.data.ModelsTable[0].ClusteringColumn;
      let res = clusterColumns
        .map((item) => item['0'])
        .filter((value, index, self) => self.indexOf(value) === index);
      setChartClusters(res);
    }
  }, [clusteringColumnData]);

  // if (!isRendered) {
  //   alert('generates original data');
  //   if (!coordinates.loading && !clusteringColumnData.loading && data) {
  //     let clusterColumns = clusteringColumnData.data.ModelsTable[0].ClusteringColumn;
  //     let final = [];
  //     for (let i=0; i<coordinates.data.DatasetsTable[0].Coordinates.length; i++) {
  //       Object.assign(coordinates.data.DatasetsTable[0].Coordinates[i], data[i], {cluster: clusterColumns[i]['0']});
  //     }
  //     console.log('coordinates.data.DatasetsTable[0].Coordinates: ', coordinates.data.DatasetsTable[0].Coordinates);
  //     setIsRendered(true);
  //     setOriginalChartData(coordinates.data.DatasetsTable[0].Coordinates);
  //   }
  // }

  useEffect(() => {
    if (!coordinates.loading && !clusteringColumnData.loading && data) {
      let clusterColumns =
        clusteringColumnData.data.ModelsTable[0].ClusteringColumn;
      let final = [];
      for (
        let i = 0;
        i < coordinates.data.DatasetsTable[0].Coordinates.length;
        i++
      ) {
        let test = {
          ...coordinates.data.DatasetsTable[0].Coordinates[i],
          ...data[i],
        };
        test.cluster = clusterColumns[i]['0'];
        final.push(test);
      }
      setOriginalChartData(final);
      setChartData(final);
    }
  }, [coordinates, data]);

  // function to allow user to assign a table row as emerging behavior or not
  const handleTableRowClicked = (index) => {
    let existingData = [...data];
    const targetRow = existingData[index];
    if (targetRow.cluster === 2) {
      existingData[index].cluster = 1;
    } else {
      existingData[index].cluster = 2;
    }
    setData(existingData);
  };

  const handleTargetRowClicked = (row) => {
    let existingData = [...data];
    const targetRow = row;
    let index = existingData.indexOf(targetRow);
    if (targetRow.cluster === 2) {
      existingData[index].cluster = 1;
    } else {
      existingData[index].cluster = 2;
    }
    setData(existingData);
  };

  // Reset Table data
  const handleResetTableData = () => {
    setData(originalData);
    setTargetRow(null);
  };

  const handleTimeSelectChange = (e) => {
    const newTimeValue = e.target.value;
    setTimeSelectValue(newTimeValue);
    // POST REQUEST SEND TIMESELECTVALUE
    // newTimeValue
    // GET REQUEST UPDATED DATA ?
    //
  };

  // function to call API when user selects a new time via the slider
  const handleSliderChangeComitted = () => {
    const currentSliderValue = sliderValue;
    // POST REQUEST HERE
    axios
      .get(`http://192.168.1.:5001/getdataset/${currentSliderValue}`)
      .then((res) => setData(res.data));
  };

  // sets state when slider moves
  const handleSliderChange = (event, value) => {
    const newSliderValue = value;
    setSliderValue(newSliderValue);
  };

  // reset cluster chart to default values
  const handleResetClusterData = () => {
    // const originalData = originalData;
    // setData(originalData);
    setSelectedCluster([]);
    setTargetRow(null);
    setSelectedXValue(null);
    setSelectedYValue(null);
    setSelectedXYValues(null);
    setChartData(originalChartData);
  };

  const handleFilterDataByClusters = (event) => {
    if (event.target.value.length === 0) {
      setData(originalData);
      setSelectedCluster([]);
      return;
    }

    // grab selected cluster number
    const selectedCluster = event.target.value;

    // if the user selects the all clusters option, return all clusters
    if (selectedCluster.includes(-1)) {
      setSelectedCluster([]);
      handleResetClusterData();
      return;
    }

    const existingData = originalData;
    let filteredData = [];

    existingData.forEach((datum) => {
      if (selectedCluster.includes(datum.cluster)) {
        filteredData.push(datum);
      }
    });

    // update data being passed to the chart with the new filtered data
    if (targetRow) {
      // reset the target row if it exists
      setData(filteredData);
      setTargetRow(null);
      setSelectedCluster(selectedCluster);
      return;
    }

    setData(filteredData);
    setSelectedCluster(selectedCluster);
  };

  // update hyperparameters
  const handleUpdateHyperparameter = (event, index) => {
    const newValue = event.target.value;
    const existingHyperparameters = hyperparameters;
    existingHyperparameters[index].value = newValue;
    setHyperparameters(existingHyperparameters);
  };

  const handleAuthenticationResult = (res) => {
    const message = res.data.message;
    if (message === 'Invalid session token.') {
      // redirect user to not authorized page
      props.routeProps.history.push('/notauthorized');
      return;
    }

    console.error(props.activeDatasetData);
    // if (!props.activeDatasetData) {
    // alert('call /data');
    axios({
      method: 'post',
      url: 'https://allvisiondocs.azurewebsites.net/data',
      data: { filename: props.selectedDataset.DatasetIDRef },
      onUploadProgress: function (progressEvent) {},
    }).then(
      (response) => {
        setData(response.data);
      },
      (error) => {
        console.log(error.response);
      }
    );
    // } else {
    //   setData(props.activeDatasetData);
    // }
  };

  useEffect(() => {
    if (!props.selectedDataset) {
      props.routeProps.history.push('/datasets');
      return;
    }

    // setIsRendered(true);
    const auth_token = props.auth_token.SessionToken;
    const config = {
      headers: { Authorization: `Bearer ${auth_token}` },
    };

    const bodyParameters = {
      key: 'value',
    };

    axios
      .post(
        'https://govoracle.azurewebsites.net/check-token',
        // 'https://allvisionflask.azurewebsites.net/check-token',
        bodyParameters,
        config
      )
      .then((res) => {
        console.log(res);
        handleAuthenticationResult(res);
      })
      .catch((error) => handleAuthenticationFailed(error));

    // handleGetData([]);
    let currentModels = models;
    const indexOfModel = props.routeProps.match.params.id
      ? props.routeProps.match.params.id
      : 1;
    const targetModel = currentModels[indexOfModel];

    setModel(targetModel);
    if (!props.modelAssignedToDEB) {
      props.assignModelToDEB(targetModel);
    }
  }, []);

  const handleChangeXValue = (e) => {
    const newXValue = e.target.value;
    setSelectedXValue(newXValue);
  };

  const handleChangeYValue = (e) => {
    const newYValue = e.target.value;
    setSelectedYValue(newYValue);
  };

  const handleSubmitXYValues = () => {
    if (!selectedXValue && !selectedYValue) {
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(true);
    } else if (!selectedXValue && selectedYValue) {
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(false);
    } else if (!selectedYValue && selectedXValue) {
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(true);
    } else {
      const newXYValues = {
        xValue: selectedXValue,
        yValue: selectedYValue,
      };

      let existingData = chartData;

      let newData = [];
      existingData.forEach((d) => {
        let newObj = {
          ...d,
          x: parseInt(d[newXYValues.xValue]),
          y: parseInt(d[newXYValues.yValue]),
        };
        newData.push(newObj);
      });

      setSelectedXYValues(newXYValues);
      // setChartData(newData);
      setChartData(newData);
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(false);
    }
  };

  const handleOpenAccessAPIModal = () => {
    setAccessAPIModalIsOpen(true);
    setDeployModelModalIsOpen(false);
  };

  const handleCloseAccessAPIModal = () => {
    setAccessAPIModalIsOpen(false);
    setDeployModelModalIsOpen(false);
  };

  const handleOpenModal = () => {
    setDeployModelModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setDeployModelModalIsOpen(false);
  };

  const handleOpenDEBModelDetailsModal = () => {
    setModelDetailsModalIsOpen(true);
  };

  const handleCloseDEBModelDetailsModal = () => {
    setModelDetailsModalIsOpen(false);
  };

  // if (showLoadingScreen) {
  //   return <LoadingScreen></LoadingScreen>;
  // }
  if (chartClusters.length > 0 && data.length > 0 && models) {
    return (
      <>
        <div
          className='sidebar-page-wrapper'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <Sidebar
            // model={this.state.model}
            models={models}
            activePage={activePage}
            routeProps={props.routeProps}
            selectedDataset={props.selectedDataset}
          ></Sidebar>
          <div className='model-detail-main-content'>
            <DEBModelDetailsModal
              model={
                props.modelAssignedToDEB ? props.modelAssignedToDEB : models[0]
              }
              models={models}
              modelDetailsModalIsOpen={modelDetailsModalIsOpen}
              handleOpenDEBModelDetailsModal={handleOpenDEBModelDetailsModal}
              handleCloseDEBModelDetailsModal={handleCloseDEBModelDetailsModal}
            ></DEBModelDetailsModal>
            {/* <AccessAPIModal
              accessAPIModalIsOpen={accessAPIModalIsOpen}
              handleCloseAccessAPIModal={handleCloseAccessAPIModal}
            ></AccessAPIModal> */}
            <DeployModelModal
              deployModelModalIsOpen={deployModelModalIsOpen}
              model={model}
              handleCloseModal={handleCloseModal}
              handleOpenAccessAPIModal={handleOpenAccessAPIModal}
            ></DeployModelModal>
            <div className='model-detail-header'>
              <h1>Detect Emerging Behaviors</h1>
              <h3>
                <Tooltip
                  title='Click to Learn More About This Model'
                  placement='top-start'
                  arrow
                >
                  <span
                    onClick={handleOpenDEBModelDetailsModal}
                    className='model-assigned-to-deb-span'
                  >
                    {props.modelAssignedToDEB.name}
                  </span>
                </Tooltip>{' '}
                model used to generate clusters, coloring determined by labels
                that were found.
              </h3>

              <div className='model-detail-header-buttons-wrapper'>
                <ModelDetailsActions
                  model={model}
                  data={data}
                  selectedYValueIsNull={selectedYValueIsNull}
                  selectedXValueIsNull={selectedXValueIsNull}
                  clusters={chartClusters}
                  selectedCluster={selectedCluster}
                  selectedXValue={selectedXValue}
                  selectedYValue={selectedYValue}
                  handleResetClusterData={handleResetClusterData}
                  handleOpenModal={handleOpenModal}
                  handleChangeXValue={handleChangeXValue}
                  handleChangeYValue={handleChangeYValue}
                  handleSubmitXYValues={handleSubmitXYValues}
                  handleFilterDataByClusters={handleFilterDataByClusters}
                ></ModelDetailsActions>
              </div>
            </div>
            {chartData.length > 0 ? (
              <Highcharts
                chartData={chartData}
                chartClusters={chartClusters}
              ></Highcharts>
            ) : (
              <>
                <h3>Loading Clusters and what not...</h3>
                <Skeleton
                  animation='wave'
                  variant='rect'
                  width={900}
                  height={250}
                />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Skeleton
                    style={{ marginTop: '.1vh' }}
                    animation='wave'
                    variant='rect'
                    width={450}
                    height={250}
                  />
                  <Skeleton
                    style={{ marginTop: '.1vh' }}
                    animation='wave'
                    variant='rect'
                    width={450}
                    height={250}
                  />
                </div>
              </>
            )}
            {/* <Highcharts chartData={chartData} chartClusters={chartClusters}></Highcharts> */}
            {/* <DEBChartAndMetricsWrapperFunc
              model={model}
              data={data}
              options={options}
              timeSelectValue={timeSelectValue}
              handleTimeSelectChange={handleTimeSelectChange}
            ></DEBChartAndMetricsWrapperFunc> */}
            {/* <DEBSlider
              style={{ marginTop: '3vh' }}
              handleSliderChange={handleSliderChange}
              handleSliderChangeComitted={handleSliderChangeComitted}
              sliderValue={sliderValue}
            ></DEBSlider> */}
            {/* <DEBTable
              style={{ marginTop: '10vh' }}
              data={data}
              targetRow={targetRow}
              handleResetTableData={handleResetTableData}
              handleTargetRowClicked={handleTargetRowClicked}
              handleTableRowClicked={handleTableRowClicked}
            ></DEBTable> */}
            {/* {
              data ? 
                <ReactVirtualizedTable data={data}></ReactVirtualizedTable>
                : null
            } */}
            {data.length > 0 ? (
              <ReactVirtualizedGrid data={data}></ReactVirtualizedGrid>
            ) : (
              <Skeleton variant='rect' width={210} height={118} />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingScreen></LoadingScreen>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DEBModelDetailsFunc);
