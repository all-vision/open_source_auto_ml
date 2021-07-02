import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ModelCard from './ModelCard';
import axios from 'axios';
import { connect } from 'react-redux';
import find_similar_datapoints_models from './find_similar_datapoints_models';
import PropTypes from 'prop-types';
import { useQuery, gql, useSubscription } from '@apollo/client';
import {
  setActiveModel,
  setAllModelNames,
  newModelIsBeingCreated,
} from '../../redux/actions/index';
import NewModelCreatedSnackbar from '../ModelDetails/NewModelCreatedSnackbar';
import base_model_names from './base_model_names';
import ModelZooSkeleton from './ModelZooSkeleton';

import '../../styles/ModelZoo/model-zoo-wrapper.css';
import '../../styles/page.css';

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveModel: (model) => dispatch(setActiveModel(model)),
    setAllModelNames: (models) => dispatch(setAllModelNames(models)),
    newModelIsBeingCreated: (bool) => dispatch(newModelIsBeingCreated(bool)),
  };
};

const mapStateToProps = (state) => {
  return {
    modelAssignedToDEB: state.modelAssignedToDEB, // model assigned to DEB Page
    auth_token: state.auth_token,
    datasetId: state.datasetId,
    // activeDatasetData: state.activeDatasetData,
    selectedDataset: state.selectedDataset,
    isNewModelBeingCreated: state.newModelIsBeingCreated,
  };
};

// const GET_MODEL_BEING_CREATED = gql`
//   query($ModelName: String) {
//     ModelsTable(where: { ModelName: { _eq: $ModelName } }) {
//       ModelName
//       TableData
//       ModelScores
//       ModelID
//       ModelHyperparameters
//       Grouped
//       DatasetID
//       ClusteringColumn
//     }
//   }
// `;

const QUERY_MODEL_ZOO = gql`
  query($DatasetID: _uuid) {
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

const GET_COORDINATES = gql`
  query($DatasetIDRef: uuid) {
    DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
      Coordinates
    }
  }
`;

function ModelZooWrapper(props) {
  const [activePage, setActivePage] = useState('unsupervised');
  const [mods, setMods] = useState([]);
  const [newMods, setNewMods] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  // const [limit, setLimit] = useState(6);
  const [loadingMoreModels, setLoadingMoreModels] = useState(false);

  const coordinates = useQuery(GET_COORDINATES, {
    variables: { DatasetIDRef: props.selectedDataset.DatasetIDRef },
    // pollInterval: 1000,
  });

  let newString = '{' + props.selectedDataset.DatasetIDRef + '}';

  const modelZooResult = useQuery(QUERY_MODEL_ZOO, {
    variables: { DatasetID: newString },
    pollInterval: 2000,
  });

  /*
  * function to load more models as the user scrolls down the page
  */
  // const loadMore = () => {
  //   if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
  //     setLoadingMoreModels(true);
  //     setTimeout(() => {
  //       let newLimit = limit + 6;
  //       setLimit(newLimit);
  //       setLoadingMoreModels(false);
  //     }, 1000);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', loadMore);
  //   return () => window.removeEventListener('scroll', loadMore);
  // });


  useEffect(() => {

    // make sure query is not loading
    if (!coordinates.loading && !modelZooResult.loading) {
      setShowSkeleton(true);
      if (coordinates.data) {
        if (coordinates.data.DatasetsTable[0].Coordinates && modelZooResult.data.ModelsTable) {
          let final = [];
          let wrapper = [];
          modelZooResult.data.ModelsTable.forEach((model) => {
  
  
            /*
            * create array to hold data to create chart for each model
            */
            let modelChartData = [];
  
            /*
            * create modelObject to contain information that we will be rendering for each card in the model zoo
            */
            let modelObject = {};
            /*
            * add hyperparameters, modeName, modelId, Model scores, and original model name to object
            */
  
            modelObject.ModelHyperparameters = model.ModelHyperparameters;
            modelObject.ModelName = model.ModelName;
            modelObject.ModelID = model.ModelID;
            modelObject.ModelScores = model.ModelScores;
            modelObject.OriginalModel = model.OriginalModel;
            // generate all of the clusters that exist for each model
            let clustersForModel = model.ClusteringColumn.map((item) => item['0']).filter(
              (value, index, self) => self.indexOf(value) === index
            );
  
            modelObject.chartClusters = clustersForModel;
            wrapper.push(modelObject);
            for (
              let i = 0;
              i < coordinates.data.DatasetsTable[0].Coordinates.length;
              i++
            ) {
              let modelChartDataObject = { ...coordinates.data.DatasetsTable[0].Coordinates[i] };
              modelChartDataObject.cluster = model.ClusteringColumn[i] ? model.ClusteringColumn[i][0] : -1;
              modelChartData.push(modelChartDataObject);
              modelObject.chartData = [{ x: 1, y: 1 }, ...modelChartData];
            }
          });
          let modelNames = wrapper.map((mod) => mod.ModelName);
          let notBaseModels = wrapper.filter(
            (m) => !base_model_names.includes(m.ModelName)
          );
          let onlyBaseModels = wrapper.filter((m) =>
            base_model_names.includes(m.ModelName)
          );
          let orderedModels = [...notBaseModels.reverse(), ...onlyBaseModels];
  
          /**
           * sort models based on silhoutte score in descending orders. Put models with sillhoute scores of 1 at the end of the list
           */
          let sortedModels = orderedModels.sort((a, b) => {
  
            const aScore = a.ModelScores[0].silhouette_score;
            const bScore = b.ModelScores[0].silhouette_score;
  
  
  
            if (aScore === 1) {
              return 1;
            } else if (bScore === 1) {
              return -1;
            }
  
            else return bScore - aScore;
          });
  
          /*
            * update state
          */
  
  
  
          setNewMods(notBaseModels);
          props.setAllModelNames(sortedModels);
          setMods(sortedModels);
          setShowSkeleton(false);
        }
      }

    }
  }, [coordinates, modelZooResult]);


  /*
  * function to handle updating the active model
  * function runs when user selects a different model from the sidebar, or clicks on a models' card
  */

  const handleSelectActiveModel = (model) => {
    props.setActiveModel(model);
    props.routeProps.history.push(`/modeldetails/${model.ModelName}`);
  };

  const handleAuthenticationResult = (res) => {
    const message = res.data.message;
    if (message === 'Invalid session token.') {
      alert('FAILURE');
      props.routeProps.history.push('/notauthorized');
      // redirect to page here
      return;
    }

    // if (props.activeDatasetData) {
    //   setModelData(props.activeDatasetData);
    // }
  };

  useEffect(() => {
    if (!props.selectedDataset) {
      props.routeProps.history.push('/datasets');
      return;
    }
    const auth_token = props.auth_token.SessionToken;
    const config = {
      headers: { Authorization: `Bearer ${auth_token}` },
    };

    const bodyParameters = {
      key: 'value',
    };

    props.setActiveModel(null);
    axios
      .post(
        'https://govoracle.azurewebsites.net/check-token',
        // 'https://allvisionflask.azurewebsites.net/check-token', - Original
        bodyParameters,
        config
      )
      .then((res) => {
        console.log(res);
        handleAuthenticationResult(res);
      })
      .catch((error) => console.error(error));
  }, []);


  /* 
    Contnet is the React component is inside the div with the className "similarr-datapoints-models-wrapper"
  */

  let content = null;
  if (showSkeleton || !mods.length > 0) {
    content = (
      <div className="model-card-wrapper">

        <ModelZooSkeleton />
      </div>
    );
  } else {

    content = (
      <>
        <h1 className="similar-datapoints-header">Unsupervised Model Zoo</h1>
        <h3 className="similar-datapoints-subtext">
          View alternative clustering outputs from <span>15</span>{' '}
          unsupervised, weakly supervised and semi-supervised machine learning
          algorithms. Adjust hyperparameters to find the best setup for your
          project.
        </h3>
        <div className="model-card-wrapper">
          {

            mods/*.slice(0, limit)*/.map((model, index) => {

              return (
                <ModelCard
                  model={model}
                  isNewModel={!base_model_names.includes(model.ModelName)}
                  key={index}
                  index={index}
                  handleSelectActiveModel={handleSelectActiveModel}

                />

              );
            })
          }
        </div>

      </>
    );
  }
 
  /*
  * if content is ready to be loaded
  * render actual UI
  */
  return (
 

    <div className="entire-content">
      <Sidebar
        activePage={activePage}
        mods={mods}
        staticModels={find_similar_datapoints_models}
        handleSelectActiveModel={handleSelectActiveModel}
        selectedDataset={props.selectedDataset}
        routeProps={props.routeProps}
      />

      <div className="main-content">
        {content}
      </div>

    </div>

  );
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ModelZooWrapper));

ModelZooWrapper.propTypes = {
  routeProps: PropTypes.object,
  selectedDataset: PropTypes.object,
  auth_token: PropTypes.object,
  // activeDatasetData: PropTypes.array,
  activeData: PropTypes.array,
  setActiveModel: PropTypes.func,
  setAllModelNames: PropTypes.func,
  newModelIsBeingCreated: PropTypes.func,
  isNewModelBeingCreated: PropTypes.object,
};