/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ModelDetailsActions from './ModelDetailsActions';
import LoadingScreen from '../Shared/Loading';
// import ChartAndMetricsWrapper from './ChartAndMetricsWrapper';
import ElbowChartAndParameters from './ElbowChartAndHyperparameters/ElbowChartAndParameters';
import AssignModelToDEBModal from './AssignModelToDEBModal';
import { connect } from 'react-redux';
import axios from 'axios';
import { useQuery, gql, useSubscription } from '@apollo/client';
// import DataTable from '../Shared/DataTable';
import Skeleton from '@material-ui/lab/Skeleton';
import ModelDetailsAlert from './ModelDetailsAlert';
import {
  newModelIsBeingCreated,
  setActiveModel,
  setAllModelNames,
} from '../../redux/actions/index';
import FilterByClusterSizeModal from './FilterByClusterSizeModal.js';
import color_palette from '../Shared/ColorPalette';
import cloneDeep from 'lodash/cloneDeep';
import NoResultsFoundSnackbar from './NoResultsFoundSnackbar.tsx';
import CircularLoader from '../ModelZoo/CircularLoader.tsx';
import NewModelNameModal from './NewModelNameModal';
import NewModelCreatedSnackbar from './NewModelCreatedSnackbar';
import ModelDetailSkeleton from './ModelDetailSkeleton';
import NewModelBeingCreatedScreen from './NewModelBeingCreatedScreen';
import '../../styles/ModelDetails/model-details-wrapper.css';
import '../../styles/page.css';

const DataTable = React.lazy(() => import('../Shared/DataTable'));

const ChartAndMetricsWrapper = React.lazy(() =>
  import('./ChartAndMetricsWrapper')
);

/*
 * map redux state to props
 */

const mapStateToProps = (state) => {
  return {
    modelAssignedToDEB: state.modelAssignedToDEB,
    selectedDataset: state.selectedDataset,
    auth_token: state.auth_token,
    activeDatasetData: state.activeDatasetData,
    allModelNames: state.allModelNames,
    activeModel: state.activeModel,
    isNewModelBeingCreated: state.newModelIsBeingCreated,
  };
};

/*
 * map redux actions to props
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setActiveModel: (model) => dispatch(setActiveModel(model)),
    setAllModelNames: (models) => dispatch(setAllModelNames(models)),
    newModelIsBeingCreated: (bool) => dispatch(newModelIsBeingCreated(bool)),
  };
};

/*
 * query model that is being created
 * query runs when a user changes hyperparameters and submits the form
 */
const GET_MODEL_BEING_CREATED = gql`
  subscription($ModelName: String, $DatasetID: _uuid) {
    ModelsTable(
      where: {
        ModelName: { _eq: $ModelName }
        _and: { DatasetID: { _eq: $DatasetID } }
      }
    ) {
      ModelName
      TableData
      ModelScores
      ModelID
      ModelHyperparameters
      Grouped
      DatasetID
      ClusteringColumn
      OriginalModel
    }
  }
`;

/*
 * query all models from the model zoo
 * runs as soon as the page loads
 * uses models to populate sidebar menu
 */
const QUERY_MODEL_ZOO = gql`
  subscription($DatasetID: _uuid) {
    ModelsTable(where: { DatasetID: { _eq: $DatasetID } }) {
      DatasetID
      ModelHyperparameters
      ModelID
      ModelName
      ModelScores
      ClusteringColumn
      OriginalModel
    }
  }
`;

/*
 * query to get the cluster numbers from the active model
 * cluster numbers are used to create the scatterplot
 */
const GET_CLUSTERING_COLUMN = gql`
  query($ModelID: Int) {
    ModelsTable(where: { ModelID: { _eq: $ModelID } }) {
      ModelHyperparameters
      ClusteringColumn
    }
  }
`;

/*
 * query to get the x,y coordinates for the scatterplot
 */
const GET_COORDINATES = gql`
  query($DatasetIDRef: uuid) {
    DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
      Coordinates
    }
  }
`;

const ModelDetailsWrapper = (props) => {
  const [model, setModel] = useState(null);
  const [data, setData] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState([]);
  const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  const [activePage, setActivePage] = useState('modeldetails');
  const [deployModelModalIsOpen, setDeployModelModalIsOpen] = useState(false);
  const [assignModelToDEBIsOpen, setAssignModelToDEBIsOpen] = useState(false);
  const [accessAPIModalIsOpen, setAccessAPIModalIsOpen] = useState(false);
  const [elbowChartData, setElbowChartData] = useState([
    12,
    2,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    1,
    1.5,
  ]);
  const [hyperparameters, setHyperparameters] = useState([
    {
      name: 'min_samples',
      value: 8,
    },
    {
      name: 'eps',
      value: 12,
    },
    {
      name: 'metric',
      value: 'euclidian',
    },
    {
      name: 'min_samples',
      value: 8,
    },
    {
      name: 'metric_params',
      value: {},
    },
    {
      name: 'algorithm',
      value: 'ball_tree',
    },
    {
      name: 'leaf_size',
      value: 30,
    },
    {
      name: 'p',
      value: 4.3,
    },
  ]);
  const [chartClusters, setChartClusters] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [originalChartData, setOriginalChartData] = useState([]);
  const [modelHyperparameters, setModelHyperparameters] = useState([]);
  const [defaultHyperparameters, setDefaultHyperparameters] = useState([]);
  const [elbowChartDropdownValue, setElbowChartDropdownValue] = useState(
    'leaf_size'
  );
  const [hyperparameterErrorInputs, setHyperparameterErrorInputs] = useState(
    []
  );
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [formattedChartData, setFormattedChartData] = useState([]);
  const [originalFormattedChartData, setOriginalFormattedChartData] = useState(
    []
  );
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [maxClusterCount, setMaxClusterCount] = useState(0);
  const [minClusterCount, setMinClusterCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);

  const [
    showNoClustersFoundSnackbar,
    setShowNoClustersFoundSnackbar,
  ] = useState(false);

  const [
    filterByClusterSizeModalIsOpen,
    setFilterByClusterSizeModalIsOpen,
  ] = useState(false);

  const [newModelNameModalIsOpen, setNewModelNameModalIsOpen] = useState(false);
  const [newModelIsBeingCreated, setNewModelISBeingCreated] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterLoadingText, setFilterLoadingText] = useState('');

  const [
    showModelIsBeingCreatedScreen,
    setShowModelIsBeingCreatedScreen,
  ] = useState(false);
  const [enableScatterplotTooltip, setEnableScatterplotTooltip] = useState(
    true
  );

  /*
   * query coordinates on page load
   * skip query if selected dataset does not exist (it is still being loaded)
   */
  const coordinates = useQuery(GET_COORDINATES, {
    skip: !props.selectedDataset.DatasetIDRef,
    variables: {
      DatasetIDRef: props.selectedDataset.DatasetIDRef,
      // offset: 0,
      // limit: 3000
    },
    // pollInterval: 500,
  });

  /*
   * query cluster column information when the page loads
   * skip if active model does not exist yet (aka it is still being loaded)
   */
  const clusteringColumnData = useQuery(GET_CLUSTERING_COLUMN, {
    skip: !props.activeModel.ModelID,
    variables: { ModelID: props.activeModel.ModelID },
    // pollInterval: 500,
  });

  // format datasetIdRef for graphql query
  let newString = '{' + props.selectedDataset.DatasetIDRef + '}';

  /*
   * query all models from the model zoo
   */
  const modelZooResult = useSubscription(QUERY_MODEL_ZOO, {
    skip: !newString,
    variables: { DatasetID: newString },
    // pollInterval: 1000,
  });

  /*
   * useEffect hook that runs everytime the model zoo changes
   * if models are loaded, set all models into state
   */
  useEffect(() => {
    if (!modelZooResult.loading && !modelZooResult.error) {
      if (modelZooResult.data.ModelsTable) {
        props.setAllModelNames(modelZooResult.data.ModelsTable);
      }
    }
  }, [modelZooResult]);

  /*
   * useEffect hook that runs whenever clusters or the active model changes
   */
  useEffect(() => {
    setShowLoadingScreen(true); // render loading screen
    if (!clusteringColumnData.loading && clusteringColumnData.data) {
      /*
       * grab all clusters
       */
      let clusterColumns =
        clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

      /*
       * create array of all of the clusters for the active model
       * contains no duplicate items
       */
      let res = clusterColumns
        .map((item) => item['0'])
        .filter((value, index, self) => self.indexOf(value) === index);

      /*
       * set this array in state
       */
      setChartClusters(res);

      /*
       * set hyperparameters in state
       * set default hyperparameters so user can reset
       */
      setModelHyperparameters(
        clusteringColumnData.data.ModelsTable[0].ModelHyperparameters[0]
      );

      setDefaultHyperparameters(
        clusteringColumnData.data.ModelsTable[0].ModelHyperparameters[0]
      );
    }
  }, [clusteringColumnData, props.activeModel]);

  /*
   * useEffect hook to create a joined array of objects
   * this hook merges the raw json data from the active file, and adds the correct cluster number to each row
   * this is needed to be able to format the data for the scatterplot
   */
  useEffect(() => {
    if (
      !coordinates.loading &&
      !clusteringColumnData.loading &&
      props.activeDatasetData
    ) {
      /*
       * grabs all of the cluster numbers
       */
      let clusterColumns =
        clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

      /*
       * creates array to hold the result after everything is merged together
       */
      let joinedObjectWrapper = [];

      if (coordinates.data.DatasetsTable) {
        /*
         * loop through each item in the coordinates array
         */
        for (
          let i = 0;
          i < coordinates.data.DatasetsTable[0].Coordinates.length;
          i++
        ) {
          /*
           * create new object
           * new object contains cluster number
           * x,y coordinates
           * json data from the active file
           */
          let joinedObject = {
            cluster: clusterColumns[i] ? clusterColumns[i]['0'] : -1,
            ...coordinates.data.DatasetsTable[0].Coordinates[i],
            ...props.activeDatasetData[i],
          };
          /*
           * push new joined object into arrau
           */
          joinedObjectWrapper.push(joinedObject);
        }
      }

      setTableData(joinedObjectWrapper);
      setOriginalTableData(joinedObjectWrapper);
      setOriginalChartData(joinedObjectWrapper);
      setChartData(joinedObjectWrapper);
    }
  }, [coordinates, props.activeDatasetData, clusteringColumnData]);

  /*
   * helper function to format data for scatterplot
   * takes chartData and chartClusters as arguments
   * both can be found in state
   */
  function formatDataForScatterplotHelper(chartData, chartClusters) {
    /*
     * create wrapper array to hold formatted data
     */
    let formattedData = [];
    const headerConstants = ['x', 'y', 'cluster'];
    let headers = [];
    Object.keys(chartData[1]).forEach((key) => {
      if (!headerConstants.includes(key)) {
        headers.push(chartData[0][key]);
      }
    });
    /*
     * loop through each cluster
     */
    chartClusters.forEach((cluster) => {
      /*
       * filter data by cluster
       */
      const filteredData = chartData.filter((data) => data.cluster === cluster);
      /*
       * create new object to hold fltered data. This is the data that will be passed in to the scatterplot
       * add cluster name
       * add cluster number
       * generate color based on cluster number
       * add filteredData
       */
      formattedData.push({
        name: cluster === -1 ? 'Anomaly' : `Cluster ${cluster}`,
        cluster: cluster,
        color: cluster === -1 ? '#cccccc' : color_palette[cluster],
        marker: {
          symbol: 'circle',
        },
        visible: true,
        /*
         * {x: 1, y:1} is needed so chart can be rendered using WebGL, better for performance
         * dont't worry about this...
         */
        data: [{ x: filteredData[0].x, y: filteredData[0].y }, ...filteredData],
      });
    });

    /*
     * @types
     * generate min and max values based on cluster size
     * min = minimum cluster size
     * max = maximum cluster size
     * used for filtering clusters by size
     */
    let dataRange = formattedData.map((d) => d.data.length);
    let min = dataRange.sort((a, b) => a - b)[0];
    let max = dataRange.sort((a, b) => a - b)[dataRange.length - 1];

    /*
     * return generated values as an object
     */
    return {
      formattedData: formattedData,
      headers: headers,
      min: min,
      max: max,
    };
  }

  /*
   * useEffect hook that runs whenever chartData or chartClusters change
   */
  useEffect(() => {
    if (chartData.length > 0 && chartClusters.length > 0) {
      /*
       * destructure data from helper function above
       * set this value in state
       */
      let { formattedData, headers, min, max } = formatDataForScatterplotHelper(
        chartData,
        chartClusters
      );
      setColumnHeaders(headers);
      setMinClusterCount(min);
      setMaxClusterCount(max);
      let clonedFormattedData = cloneDeep(formattedData);
      setOriginalFormattedChartData(clonedFormattedData);
      setFormattedChartData(formattedData);
      /*
       * after all data is formatted
       * hide loading screen
       */
      setTimeout(function () {
        setShowLoadingScreen(false);
      }, 1000);
      // alert('finish loading model');
    }
  }, [chartData, chartClusters]);

  // helper function to check if input is a float
  function isFloat(value) {
    if (!isNaN(value) && value.toString().indexOf('.') != -1) {
      return true;
    }
    return false;
  }

  /*
   * toggle tooltip on and off
   */
  const handleToggleToolTip = () => {
    setEnableScatterplotTooltip(!enableScatterplotTooltip);
  };

  /*
   * function to handle updating a hyperparameter
   */
  const handleUpdateHyperparameter = (event, param) => {
    /*
     * grab new value to update
     * grab existing hyperparameters
     * clone existingHyperparameters so we do not mess up state
     * update the targetHyperparameters and set updated state
     */
    const newValue = event.target.value;
    let existingHyperparameters = modelHyperparameters;
    let clone = Object.assign({}, existingHyperparameters);
    clone[param] = newValue;
    setModelHyperparameters(clone);
  };

  /*
   * set hyperparameters to default hyperparameters
   */
  const handleResetHyperparameters = () => {
    setModelHyperparameters(defaultHyperparameters);
  };

  /*
   * query to check when a new model has finished begin created
   * useSubscription is an Apollo Graphql hook that listens for changes on the server
   * skip query if no new model is being created
   */
  let formattedDatasetIdRef = '{' + props.selectedDataset.DatasetIDRef + '}';
  const newModelIsDoneBeingCreated = useSubscription(GET_MODEL_BEING_CREATED, {
    skip: !props.isNewModelBeingCreated,
    variables: {
      ModelName: props.isNewModelBeingCreated.newModelName,
      DatasetID: formattedDatasetIdRef,
    },
  });

  /*
   * toggle loading screen while new model is being created
   * hide when data is returned from the query above, meaning new model has finished building
   */
  if (
    !newModelIsDoneBeingCreated.loading &&
    !newModelIsDoneBeingCreated.error
  ) {
    if (newModelIsDoneBeingCreated.data) {
      if (
        newModelIsDoneBeingCreated.data.ModelsTable.length > 0 &&
        props.isNewModelBeingCreated.newModelName.length > 0
      ) {
        setTimeout(function () {
          const newModel = newModelIsDoneBeingCreated.data.ModelsTable[0];
          setShowModelIsBeingCreatedScreen(false);
          setNewModelISBeingCreated(true);
          handleSelectActiveModel(newModel);
          props.newModelIsBeingCreated({
            isBeingCreated: false,
            newModelName: '',
          });
          setTimeout(() => {
            setNewModelISBeingCreated(false);
          }, 3000);
        }, 3000);
      }
    }
  }

  /*
   * function to run when user submits new hyperparameters
   * will call the model zoo
   */
  const handleSubmitHyperparameters = (newModelName) => {
    props.newModelIsBeingCreated({
      isBeingCreated: true,
      newModelName: newModelName,
    });
    let datasetIDRef = props.selectedDataset.DatasetIDRef;

    let modelHyperparametersCopy = cloneDeep(modelHyperparameters);

    // convert every current hyperparameter to a string for backend
    function toString(o) {
      Object.keys(o).forEach((k) => {
        if (o[k] && typeof o[k] === 'object') {
          return toString(o[k]);
        }
        o[k] = '' + o[k];
      });

      return o;
    }

    const modelHyperparametersToString = toString(modelHyperparametersCopy);

    /*
     * generate new x,y coordinates
     */
    axios({
      method: 'post',
      
      url: 'https://allvisiongov.azurewebsites.net/embed',
      data: {
        filename: datasetIDRef,
      },
    }).then(
      (response) => {
        console.log('new response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    /*
     * check the originalModel of the new model
     * re-run the appropriate model
     * TODO: this should be moved into a seperate utils file
     */

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'dbscan'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/dbscan_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'birch'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/birch_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'weighted'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/weighted_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'hdbscan'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/hdbscan_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'optics'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/optics_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'complete'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/complete_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'single'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/single_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'average'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/average_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim().toLowerCase() ===
      'median'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/median_new',
        data: {
          filename: datasetIDRef, // datasetId
          model_name: newModelName, // modelName, (new model name the user created)
          hyperparameters: modelHyperparametersToString, // dict of updated hyperparameters
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (props.activeModel.OriginalModel.trim() === 'Agglomerative'.trim()) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/agglomerative_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }

    if (
      props.activeModel.OriginalModel.trim() === 'KMeans'.trim().toLowerCase()
    ) {
      axios({
        method: 'post',
        url: 'https://allvisiongov.azurewebsites.net/kmeans_new',
        data: {
          filename: datasetIDRef,
          model_name: newModelName,
          hyperparameters: modelHyperparametersToString,
        },
      }).then(
        (response) => {
          console.log('new response: ', response);
          setShowModelIsBeingCreatedScreen(true);
        },
        (error) => {
          console.warn('error: ', error);
        }
      );
    }
    props.newModelIsBeingCreated({
      isBeingCreated: true,
      newModelName: newModelName,
    });
  };

  // ELBOW CHART
  const handleUpdateSelectedHyperparameter = (event) => {
    const newSelectedHyperparameter = event.target.value;
    setElbowChartDropdownValue(newSelectedHyperparameter);
  };

  /*
   * function to filter data by the "select clusters" dropdown
   */
  const handleFilterDataByCluster = (e) => {
    setIsFiltering(true);
    const targetClusters = e.target.value;
    setFilterLoadingText('Filtering Data By Cluster');

    /*
     * if there are no selected clusters, reset all data
     */
    if (!targetClusters.length > 0) {
      setSelectedClusters([]);
      setFormattedChartData(originalFormattedChartData);
      setTimeout(function () {
        setIsFiltering(false);
      }, 1000);
      return;
    }
    /*
     * if user selects 'All Clusters' from dropdown, reset all data
     */
    if (targetClusters.includes('All Clusters')) {
      setSelectedClusters([]);
      setFilterLoadingText('Resetting Data');
      setFormattedChartData(originalFormattedChartData);
      setTimeout(function () {
        setIsFiltering(false);
      }, 1000);
      return;
    }

    /*
     * filter table data by cluster
     */
    let existingTableData = [...originalTableData];
    const filteredTableData = existingTableData.filter((d) =>
      targetClusters.includes(d.cluster)
    );

    setTableData(filteredTableData);

    // deep clone original chart data to prevent any direct mutation of state
    let test = cloneDeep(originalFormattedChartData);
    /*
     * filter scatterplot data by cluster
     */
    let formattedData = test.filter(
      (t) => targetClusters.indexOf(t.cluster) !== -1
    );

    /*
     * update state with filtered data
     */
    setTimeout(() => {
      setFormattedChartData(formattedData);
      setSelectedClusters(targetClusters);
    }, 100);

    /*
     * hide loading screen
     */
    setTimeout(function () {
      setIsFiltering(false);
    }, 1000);
  };

  /*
   * function to reset all data on the page
   * gets triggered when the user hits the "Reset Data" button in the UI
   */

  const handleResetClusterData = () => {
    /*
     * render loading text to let the user know what is happening
     */
    setIsFiltering(true);
    setFilterLoadingText('Resetting Data');

    /*
     * reset state to default values
     */
    setTimeout(() => {
      let clusterColumns =
        clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

      let res = clusterColumns
        .map((item) => item['0'])
        .filter((value, index, self) => self.indexOf(value) === index);

      setChartClusters(res);
      setSelectedCluster([]);
      setSelectedClusters([]);
      setSelectedXValueIsNull(null);
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(false);
      setChartData(originalChartData);
      setTableData(originalTableData);
      setFormattedChartData(originalFormattedChartData);
      setIsFiltering(false);
    }, 100);

    /*
     * after 1 second, hide loading screen
     */
    setTimeout(() => {
      setIsFiltering(false);
    }, 1000);
  };

  /*
   * function to check if user is authenticated
   */
  const handleAuthenticationResult = (res) => {
    /*
     * redirect user if they do not have a valid token
     */
    const message = res.data.message;
    if (message === 'Invalid session token.') {
      alert('FAILURE');
      props.routeProps.history.push('/notauthorized');
      return;
    }

    /*
     * if there is no active data load data from API again
     * this should never happen...
     */
    if (!props.activeDatasetData) {
      axios({
        method: 'post',
        url: 'https://allvisionmodels.azurewebsites.net/data',
        data: { filename: props.selectedDataset.DatasetIDRef },
        onUploadProgress: function (progressEvent) {},
      }).then(
        (response) => {
          // setTableData(response.data);
          setData(response.data);
        },
        (error) => {
          console.log(error.response);
        }
      );
    }
  };

  /*
   * useEffect hook that runs whenever the user switches from one model to another
   * check that a selected dataset exists, if not send user back to datasets page
   */
  useEffect(() => {
    /*
     * if the user did not select a dataset, kick them to the datasets page
     */
    if (!props.selectedDataset) {
      props.routeProps.history.push('/datasets');
      return;
    }

    /*
     * grab auth token from props (passed in from redux)
     * ping API and check if user has an active token
     */
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
      .catch((error) => console.error('error: ', error));

    /*
     * set active model
     */
    setModel(props.activeModel);
  }, [props.routeProps.match.params.id]);

  /*
   * function that runs when user hits "submit changes" button in the UI
   */
  const handleSubmitXYValues = (selectedXValue, selectedYValue) => {
    /*
     * if user did not select anything from the X,Y dropdowns
     * render error message on both dropdowns
     */
    if (!selectedXValue && !selectedYValue) {
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(true);
    } else if (!selectedXValue && selectedYValue) {
      /*
       * if user selected a Y value but not an X value
       * only render error message on X Value dropdown
       */
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(false);
    } else if (!selectedYValue && selectedXValue) {
      /*
       * if user only selected X value but not a Y value
       * only render error message on Y value dropdown
       */
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(true);
    } else {
      /*
       * this block runs if user has selected both an X and Y value from the dropdown
       * render loading text
       */
      setIsFiltering(true);
      setFilterLoadingText('Reassigning X and Y Values');
      /*
       * grab new X and Y values
       */
      const newXYValues = {
        xValue: selectedXValue,
        yValue: selectedYValue,
      };

      /*
       * grab existing data
       * loop through existing data and reassign X and Y coordinates
       */
      let existingData = [...formattedChartData];
      let reassignedXYData = [];
      existingData.forEach((series) => {
        let newSeries = cloneDeep(series);
        newSeries.data.forEach((d) => {
          d.x = parseFloat(d[newXYValues.xValue]);
          d.y = parseFloat(d[newXYValues.yValue]);
        });
        reassignedXYData.push(newSeries);
      });

      /*
       * update state with new data
       * hide loading text after one second
       */
      setFormattedChartData(reassignedXYData);
      setTimeout(() => {
        setIsFiltering(false);
      }, 1000);
    }
  };

  /*
   * function to filter data by cluster size
   * runs when user clicks "filter by cluster size" button in the UI
   */
  const handleFilterDataByClusterSize = (values) => {
    /*
     * set loading text
     * grab min and max values from the function parameters
     * min = minimum cluster size the user wants
     * max = maximum cluster size the user wants
     */

    setIsFiltering(true);
    setFilterLoadingText('Filtering Data by Cluster Size');
    const min = values[0];
    const max = values[1];

    /*
     * create copy of data to avoid directly mutating state
     * filter data by min and max value
     */
    let existingData = cloneDeep(originalFormattedChartData);
    let filteredData = existingData.filter(
      (d) => d.data.length >= min && d.data.length <= max
    );
    /*
     * check that filtered data exists, aka the result is not empty
     * if there is data, update state
     * UI will now re-render
     */
    if (filteredData.length > 0) {
      setShowNoClustersFoundSnackbar(false);
      setFormattedChartData(filteredData);
      setFilterByClusterSizeModalIsOpen(false);
      setTimeout(() => {
        setIsFiltering(false);
      }, 1000);
      return;
    }

    /*
     * if there is no data, show  an alert to the user
     */
    setShowNoClustersFoundSnackbar(true);
    setIsFiltering(false);
    return;
  };

  /*
   * function to open new model name modal
   * is triggered when user hits "submit hyperparemeters button"
   */
  const handleOpenNewModelNameModal = (params) => {
    setModelHyperparameters(params);
    setNewModelNameModalIsOpen(true);
  };

  /*
   * close new model name is open modal
   */
  const handleCloseNewModelNameModal = () => {
    setNewModelNameModalIsOpen(false);
  };

  /*
   * open filter by cluster size modal
   */
  const handleOpenFilterByClusterSizeModal = () => {
    setFilterByClusterSizeModalIsOpen(true);
  };

  /*
   * close filter by cluster size modal
   */
  const handleCloseFilterByClusterSizeModal = () => {
    setFilterByClusterSizeModalIsOpen(false);
  };

  /*
   * function to select a new model
   * updates redux and redirects user to new model page
   */

  const handleSelectActiveModel = (model) => {
    props.setActiveModel(model);
    props.routeProps.history.push(`/modeldetails/${model.ModelName}`);
  };

  /*
   * if new model is being created, render specific loading screen
   */
  if (showModelIsBeingCreatedScreen) {
    return (
      <div className='overflow-hidden'>
        <NewModelBeingCreatedScreen
          modelHyperparameters={modelHyperparameters}
        />
      </div>
    );
  }
  /*
   * if content is still loading
   * render skeleton components
   */

  if (showLoadingScreen || !props.isNewModelBeingCreated) {
    return (
      <div className='entire-content'>
        <Sidebar
          model={model}
          handleSelectActiveModel={handleSelectActiveModel}
          mods={props.allModelNames}
          activePage={activePage}
          routeProps={props.routeProps}
          selectedDataset={props.selectedDataset}
        ></Sidebar>
        <div className='main-content'>
          <ModelDetailSkeleton />
        </div>
      </div>
    );
  }

  /*
   * if all data has loaded, show user the actual UI
   */
  if (chartClusters && props.activeDatasetData && chartData && model) {
    return (
      <div className='entire-content'>
        <Sidebar
          model={model}
          handleSelectActiveModel={handleSelectActiveModel}
          mods={props.allModelNames}
          activePage={activePage}
          routeProps={props.routeProps}
          selectedDataset={props.selectedDataset}
        ></Sidebar>
        <div className='main-content'>
          <NoResultsFoundSnackbar
            showNoClustersFoundSnackbar={showNoClustersFoundSnackbar}
          ></NoResultsFoundSnackbar>
          <NewModelCreatedSnackbar
            newModelIsBeingCreated={newModelIsBeingCreated}
          ></NewModelCreatedSnackbar>
          <NewModelNameModal
            handleSubmitHyperparameters={handleSubmitHyperparameters}
            newModelNameModalIsOpen={newModelNameModalIsOpen}
            handleCloseNewModelNameModal={handleCloseNewModelNameModal}
          ></NewModelNameModal>
          <FilterByClusterSizeModal
            chartData={formattedChartData}
            minClusterCount={minClusterCount}
            maxClusterCount={maxClusterCount}
            handleFilterDataByClusterSize={handleFilterDataByClusterSize}
            chartClusters={chartClusters}
            filterByClusterSizeModalIsOpen={filterByClusterSizeModalIsOpen}
            handleCloseFilterByClusterSizeModal={
              handleCloseFilterByClusterSizeModal
            }
          ></FilterByClusterSizeModal>
          <AssignModelToDEBModal
            assignModelToDEBIsOpen={assignModelToDEBIsOpen}
            model={model}
            routeProps={props.routeProps}
          ></AssignModelToDEBModal>
          <div className='model-detail-header'>
            <h1>{model.ModelName} Details</h1>
            <h3>
              Coordinates generated by UMAP, coloring determined by labels that
              were found.
            </h3>
            <div className='model-detail-header-buttons-wrapper'>
              <ModelDetailsActions
                model={model}
                data={props.activeDatasetData}
                selectedCluster={selectedCluster}
                enableScatterplotTooltip={enableScatterplotTooltip}
                handleToggleToolTip={handleToggleToolTip}
                selectedYValueIsNull={selectedYValueIsNull}
                selectedXValueIsNull={selectedXValueIsNull}
                clusters={chartClusters.sort((a, b) => a - b)}
                selectedClusters={selectedClusters}
                handleFilterDataByCluster={handleFilterDataByCluster}
                handleResetClusterData={handleResetClusterData}
                handleSubmitXYValues={handleSubmitXYValues}
              ></ModelDetailsActions>
            </div>
          </div>
          <ModelDetailsAlert></ModelDetailsAlert>
          {formattedChartData && formattedChartData.length > 0 ? (
            <ChartAndMetricsWrapper
              model={model}
              enableScatterplotTooltip={enableScatterplotTooltip}
              chartData={formattedChartData}
              minClusterCount={minClusterCount}
              isFiltering={isFiltering}
              filterLoadingText={filterLoadingText}
              maxClusterCount={maxClusterCount}
              selectedClusters={selectedClusters}
              chartClusters={chartClusters}
              columnHeaders={columnHeaders}
              handleOpenFilterByClusterSizeModal={
                handleOpenFilterByClusterSizeModal
              }
              data={props.activeDatasetData}
            ></ChartAndMetricsWrapper>
          ) : (
            <CircularLoader></CircularLoader>
          )}

          <ElbowChartAndParameters
            model={model}
            selectedDataset={props.selectedDataset}
            elbowChartData={elbowChartData}
            hyperparameterErrorInputs={hyperparameterErrorInputs}
            handleOpenNewModelNameModal={handleOpenNewModelNameModal}
            handleUpdateHyperparameter={handleUpdateHyperparameter}
            handleSubmitHyperparameters={handleSubmitHyperparameters}
            handleUpdateSelectedHyperparameter={
              handleUpdateSelectedHyperparameter
            }
            hyperparameters={hyperparameters}
            modelHyperparameters={modelHyperparameters}
            defaultHyperparameters={defaultHyperparameters}
            handleResetHyperparameters={handleResetHyperparameters}
            elbowChartDropdownValue={elbowChartDropdownValue}
          ></ElbowChartAndParameters>
          <div className='model-details-data-table-wrapper'>
            {tableData.length > 0 && model ? (
              <DataTable
                data={tableData}
                model={model}
                selectedClusters={selectedClusters}
                columnHeaders={columnHeaders}
              ></DataTable>
            ) : (
              <Skeleton variant='rect' width={210} height={118} />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingScreen></LoadingScreen>;
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ModelDetailsWrapper));
