/**
 * ClusterExploration.js
 * 
 * This React Component is a wrapper for the entire Cluster Exploration Page,
 * The children components include the 
 *      Cluster Table and the Cluster Cards
 * 
 * 
 * 
 */


/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ClusterCard from './ClusterCard/ClusterCard';
import { useQuery, gql, useSubscription } from '@apollo/client';
import color_palette from '../Shared/ColorPalette';
import { connect } from 'react-redux';
import ModelZooSkeleton from '../ModelZoo/ModelZooSkeleton';
import cloneDeep from 'lodash/cloneDeep';
import ClusterExplorationActions from './ClusterExplorationActions';
// import Scatterplot from './ClusterCard/ClusterScatterplot';
// import randomData from './ClusterTableComponents/ViolinPlot/random-data.json';
import { Link } from 'react-router-dom';

import ClusterTable from '../ClusterExploration/ClusterTableComponents/ClusterTable';

import {
  setAllClusterNames,
  setActiveModelClusterExploration,
} from '../../redux/actions/index';
import '../../styles/ClusterExploration/cluster-exploration-wrapper.css';

/*
 * COMPONENTS NEEDED
 * Cluster Card
 * cluster metrics
 * cluster graph
 * violin chart
 * scatterplot
 * metrics section
 * # of points
 * cluster center
 */

const QUERY_MODEL_ZOO = gql`
  query($ModelName: String, $DatasetID: _uuid) {
    ModelsTable(
      where: {
        ModelName: { _eq: $ModelName }
        _and: { DatasetID: { _eq: $DatasetID } }
      }
    ) {
      ClusteringColumn
      ModelID
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

const mapDispatchToProps = (dispatch) => {
  return {
    setAllClusterNames: (clusters) => dispatch(setAllClusterNames(clusters)),
    setActiveModelClusterExploration: (model) =>
      dispatch(setActiveModelClusterExploration(model)),
  };
};

const mapStateToProps = (state) => {
  return {
    modelAssignedToDEB: state.modelAssignedToDEB, // model assigned to DEB Page
    auth_token: state.auth_token,
    datasetId: state.datasetId,
    activeDatasetData: state.activeDatasetData,
    selectedDataset: state.selectedDataset,
    isNewModelBeingCreated: state.newModelIsBeingCreated,
    allClusterNames: state.allClusterNames,
    allModelNames: state.allModelNames,
    activeModelClusterExploration: state.activeModelClusterExploration,
  };
};

function ClusterExploration(props) {
  const [datasetId, setDatasetId] = useState('');
  const [datasetIdRef, setDatasetIdRef] = useState('');

  /*
    Not to sure what this is 
  */
  const [coordinates, setCoordinates] = useState([]);

  // clusterColumns are the names for each of the features (i.e. Price, Dividend Yield, Price Earnings Ratio)
  const [clusterColumns, setClusterColumns] = useState([]);
  /*
    clusterInformation is an array of clusterObjects that contain information such as 
    color, clusterNumber, the data for the column
  */
  const [clusterInformation, setClusterInformation] = useState([]);
  const [originalClusterInformation, setOriginalClusterInformation] = useState([]);

  /*
    checkedClusters: list of clusters that are checked in the cluster cards section
  */
  const [checkedClusters, setCheckedClusters] = useState([]);

  /*
    displayedClusters: list of clusters that are displayed with density charts,
    This state is set after 'Compare Clusters' is clicked and is derived from
    checkedClusters
  */
  const [displayedClusters, setDisplayedClusters] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [activeCluster, setActiveCluster] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [activeModel, setActiveModel] = useState('KMeans');

  /*
    State on whether cluster cards are loading when model screen changes 
  */
  const [showChangingModelScreen, setShowChangingModelScreen] = useState(false);
  const [sortBy, setSortBy] = useState('');

  /*
    Error State, set by ClusterTable.js if the API to /most_different_columns
    returns an error
  */
  const [error, setError] = useState(null);
  const [activeModelID, setActiveModelID] = useState(null);

  useEffect(() => {
    const datasetId = '{' + props.selectedDataset.DatasetIDRef + '}';

    setDatasetId(datasetId);
    props.setActiveModelClusterExploration(props.allModelNames[0].ModelName);
    const datasetIdRef = props.selectedDataset.DatasetIDRef;
    setDatasetIdRef(datasetIdRef);
  }, [props.selectedDataset.DatasetIDRef]);

  const TARGET_MODEL = useQuery(QUERY_MODEL_ZOO, {
    skip: !datasetId,
    pollInterval: 500,
    variables: {
      DatasetID: datasetId,
      // ModelName: 'KMeans '
      ModelName: props.activeModelClusterExploration
        ? props.activeModelClusterExploration
        : 'KMeans',
    },
  });

  const COORDINATES = useQuery(GET_COORDINATES, {
    skip: !datasetIdRef,
    pollInterval: 500,
    variables: {
      DatasetIDRef: datasetIdRef,
    },
  });

  if (!TARGET_MODEL.loading && !TARGET_MODEL.error) {
    if (TARGET_MODEL.data) {
      if (TARGET_MODEL.data.ModelsTable[0]) {
        setTimeout(() => {
          setActiveModelID(TARGET_MODEL.data.ModelsTable[0].ModelID);
          setClusterColumns(TARGET_MODEL.data.ModelsTable[0].ClusteringColumn);
        }, 500);
      } 
    }
  }

  if (!COORDINATES.loading && !COORDINATES.error) {
    if (COORDINATES.data) {
      setTimeout(() => {
        setCoordinates(COORDINATES.data.DatasetsTable[0].Coordinates);
      }, 500);
    }
  }

  useEffect(() => {
    const uniqueClusters = clusterColumns
      .map((item) => item['0'])
      .filter((value, index, self) => self.indexOf(value) === index);

    const columnHeaders = Object.values(props.activeDatasetData[0]);
    setColumnHeaders(columnHeaders);

    let clustersWrapper = [];
    let joined = [];
    // Go from [1,clusterColumns.length) inorder to insure that the column headers are not included in the data
    for (let i = 1; i < clusterColumns.length; i++) {
      let joinedObj = {
        ...coordinates[i],
        ...props.activeDatasetData[i],
        cluster: clusterColumns[i][0],
      };

      joined.push(joinedObj);
    }

    uniqueClusters.forEach((cluster, index) => {
      let filteredObject = joined.filter((obj) => obj.cluster === cluster);

      let wrapper = {
        id: cluster,
        name: `Cluster ${cluster}`,
        color: cluster === -1 ? '#cccccc' : color_palette[cluster],
        marker: {
          symbol: 'circle',
        },
        // data: [{ x: filteredObject[0], y: filteredObject[0] }, ...filteredObject],
        data: filteredObject,

        // data: [{ x: 1, y: 1 }, ...filteredData],
        checked: false,
      };

      clustersWrapper.push(wrapper);
    });

    let names = clustersWrapper.map((cluster) => cluster.name);

    props.setAllClusterNames(names);
    setOriginalClusterInformation(cloneDeep(clustersWrapper));
    setClusterInformation(clustersWrapper);
  }, [coordinates, clusterColumns]);

  /**
   * @param  {string} sortValue
   * function to sort cluster cards in ascending or descending order based on input string
   */
  const handleSortByClusterSize = (sortValue) => {
    setSortBy(sortValue);
    const existingClusters = cloneDeep(originalClusterInformation);
    let sortedClusters;
    if (sortValue === 'asc') {
      sortedClusters = existingClusters.sort(
        (a, b) => a.data.length - b.data.length
      );
    } else {
      sortedClusters = existingClusters.sort(
        (a, b) => b.data.length - a.data.length
      );
    }
    setClusterInformation(sortedClusters);
  };

  const handleSelectActiveCluster = (cluster) => {
    setActiveCluster(cluster);
    props.routeProps.history.push(`/cluster/${cluster}`);
  };

  const handleSelectClusterForComparison = (index) => {
    const clonedClusterInformation = cloneDeep(clusterInformation);

    const targetCluster = clonedClusterInformation.filter(
      (cluster) => cluster.name === index
    )[0];

    if (
      clonedClusterInformation.filter((cluster) => cluster.checked === true)
        .length +
      1 >
      5 /*2*/ &&
      targetCluster.checked !== true
    ) {
      alert('Can only compare two clusters at a time.');
      return;
    }

    clonedClusterInformation.forEach((cluster) => {
      if (cluster === targetCluster) {
        cluster.checked = !cluster.checked;
      }
    });
    const checkedClusters = clonedClusterInformation.filter(
      (cluster) => cluster.checked === true
    );
    setCheckedClusters(checkedClusters);

    setClusterInformation(clonedClusterInformation);
  };

  const handleChangeModel = (newModel) => {
    setShowChangingModelScreen(true);
    setActiveModel(newModel);
    clearChart();
    props.setActiveModelClusterExploration(newModel);
    setTimeout(() => {
      setShowChangingModelScreen(false);
    }, 2000);
  };

  /**
   * Function to show the Violin Plots.
   * Will set ShowChart to True
   * Also set setState for checkedClusters, in the case that more clusters were selected
   *
   */

  const displayChart = () => {
    setDisplayedClusters(checkedClusters);
    setShowChart(true);
  };

  /**
   * Function for the CLEAR/RESET Button
   * Sets CheckedClusters List to Empty
   * Sets all Cluster.checked property to false
   * Sets showChart to false
   */
  const clearChart = () => {
    setCheckedClusters([]);
    setShowChart(false);
    setError(null);
    setClusterInformation((prevClusterInformation) => {
      return prevClusterInformation.map((cluster) => ({
        ...cluster,
        checked: false,
      }));
    });
  };

  const logError = (e) => {
    setError(e);
  };

  if (clusterInformation.length === 0 || props.allModelNames.length === 0) {
    return (
      <div className="sidebar-page-wrapper">
        <Sidebar
          activePage={'cluster-exploration'}
        // models={models}
        />
        <div className="cluster-exploration-wrapper">
          <div className="model-card-wrapper">
            <ModelZooSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="sidebar-page-wrapper"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <Sidebar
          activePage={'cluster-exploration'}
          activeCluster={activeCluster}
          routeProps={props.routeProps}
          handleSelectActiveCluster={handleSelectActiveCluster}
          clusters={props.allClusterNames}
        />

        <div
          className="cluster-exploration-wrapper"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <h1 style={{ fontSize: '1.6rem' }}>
            {' '}
            {props.activeModelClusterExploration
              ? props.activeModelClusterExploration
              : 'KMeans '}
            Cluster Exploration
          </h1>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            {/* <div className='cluster-exploration-header'>
              <h3>Clusters: {clusterInformation.length}</h3>
            </div> */}
            <ClusterExplorationActions
              checkedClusters={checkedClusters}
              showChart={showChart}
              displayChart={displayChart}
              clearChart={clearChart}
              activeModel={props.activeModelClusterExploration}
              handleSortByClusterSize={handleSortByClusterSize}
              handleChangeModel={handleChangeModel}
              sortBy={sortBy}
              allModelNames={props.allModelNames.map(
                (model) => model.ModelName
              )}
            />
          </div>

          <ClusterTable
            clusters={displayedClusters}
            columnHeaders={columnHeaders}
            visible={showChart}
            datasetId={datasetIdRef}
            firstRow={props.activeDatasetData[0]}
            activeModel={props.activeModelClusterExploration}
            activeModelID={activeModelID}
            logError={logError}
            error={error}
          />

          {(() => {
            if (showChangingModelScreen) {
              return (
                <h3 style={{ marginTop: '3vh', fontFamily: '400' }}>
                  Updating Model
                </h3>
              );
            } else {
              return (
                <section className="cluster-exploration-card-grid">
                  {clusterInformation.map((cluster, index) => {
                    return (
                      <ClusterCard
                        key={index}
                        index={index}
                        columnHeaders={columnHeaders}
                        handleSelectActiveCluster={handleSelectActiveCluster}
                        cluster={cluster}
                        checkedClusters={checkedClusters}
                        handleSelectClusterForComparison={
                          handleSelectClusterForComparison
                        }
                      />
                    );
                  })}
                </section>
              );
            }
          })()}
        </div>
      </div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterExploration);
