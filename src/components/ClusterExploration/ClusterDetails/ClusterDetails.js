import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../Sidebar/Sidebar';
import { connect } from 'react-redux';
import color_palette from '../../Shared/ColorPalette';
import { useQuery, gql, useSubscription } from '@apollo/client';
import Scatterplot from '../ClusterCard/ClusterScatterplot';
import ClusterDetailsActions from './ClusterDetailsActions';
import cloneDeep from 'lodash/cloneDeep';
import ClusterMetrics from './ClusterMetrics';
import DataTable from '../../Shared/DataTable';
import Alert from '../../ModelDetails/ModelDetailsAlert';
import ClusterDetailsSkeleton from '../../ModelDetails/ModelDetailSkeleton';
import axios from 'axios';
import DensityPlot from './DensityPlot';
import ClusterTableLoading from '../ClusterTableComponents/ClusterTableLoading';
import Button from '@material-ui/core/Button';
import ClusterTableError from '../ClusterTableComponents/ClusterTableError';
// import '../../../styles/ClusterExploration/cluster-details-wrapper.css';
import '../../../styles/ClusterExploration/cluster-details-density-plots.css';
import '../../../styles/page.css';

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

const mapStateToProps = (state) => {
  return {
    allClusterNames: state.allClusterNames,
    activeDatasetData: state.activeDatasetData,
    selectedDataset: state.selectedDataset,
    activeModelClusterExploration: state.activeModelClusterExploration,
  };
};

function ClusterDetails(props) {
  const [activeCluster, setActiveCluster] = useState([]);

  const [datasetId, setDatasetId] = useState('');
  const [datasetIdRef, setDatasetIdRef] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [clusterColumns, setClusterColumns] = useState([]);
  const [clusterInformation, setClusterInformation] = useState([]);
  const [originalClusterInformation, setOriginalClusterInformation] = useState(
    []
  );
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [showAllOtherClusters, setShowAllOtherClusters] = useState(true);
  const [showToolTip, setShowTooltip] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [targetCluster, setTargetCluster] = useState([]);
  const [dataForViolin, setDataForViolin] = useState([]);
  const [
    allOtherClustersDataForViolin,
    setAllOtherClustersDataForViolin,
  ] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [violinPlotData, setViolinPlotData] = useState([]);
  const [integerOnlyColumnNames, setIntegerOnlyColumnNames] = useState([]);
  const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  const [loadingDensityPlots, setLoadingDensityPlots] = useState(false);
  const [error, setError] = useState(null);
  const [targetModelID, setTargetModelID] = useState(null);
  const [densityPlotImages, setDensityPlotImages] = useState([]);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const datasetId = '{' + props.selectedDataset.DatasetIDRef + '}';
    setDatasetId(datasetId);

    const datasetIdRef = props.selectedDataset.DatasetIDRef;
    setDatasetIdRef(datasetIdRef);
  }, [props.selectedDataset.DatasetIDRef]);

  const TARGET_MODEL = useQuery(QUERY_MODEL_ZOO, {
    skip: !datasetId,
    pollInterval: 500,
    variables: {
      DatasetID: datasetId,
      ModelName: props.activeModelClusterExploration
        ? props.activeModelClusterExploration
        : 'KMeans ',
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
      setTimeout(() => {
        // setTargetModelID and clusteringColumn
        setTargetModelID(TARGET_MODEL.data.ModelsTable[0].ModelID);
        setClusterColumns(TARGET_MODEL.data.ModelsTable[0].ClusteringColumn);
      }, 500);
    }
  }

  if (!COORDINATES.loading && !COORDINATES.error) {
    if (COORDINATES.data) {
      setTimeout(() => {
        setCoordinates(COORDINATES.data.DatasetsTable[0].Coordinates);
      }, 500);
    }
  }
  /**
   * hook to run when most different columns are loaded, and when the modelID has been set
   * calls api and returns imagestrings in base64 format which can be used to generate density plot images
   */
  useEffect( async () => {
    if (targetModelID && selectedColumns) {
      const targetColumns = selectedColumns.slice(0, limit);
      let newImageStrings = [];
      await Promise.all(
        targetColumns.map(async (column) => {
          const url = `https://clusterexploration-gov.azurewebsites.net/kde_one_cluster_vs_rest?modelID=${targetModelID}&column=${column}&cluster=${targetCluster}`;
          try {
            const response = await axios.post(
              url,
              {},
              {
                headers: {
                  'Access-Control-Allow-Origin': '*'
                },
              }
            );
            const apiResponse = await response;
            newImageStrings.push({
              imageString: apiResponse.data,
              column: column
            });
  
          } catch (e) {
            console.log('e: ', e);
          } 
        })
      );
      setDensityPlotImages(newImageStrings);
      setLoadingDensityPlots(false);
    }
  }, [targetModelID, selectedColumns, limit, error]);
  /**
   * function to reset all data on the page
   * resets x,y values
   */
  const handleResetData = () => {
    setClusterInformation(originalClusterInformation);
    setSelectedXValueIsNull(false);
    setSelectedYValueIsNull(false);
  };

  /**
   * @param  {string} selectedXValue
   * @param  {string} selectedYValue
   * * Takes in two strings and reassigns the x and y values of the scatterplot
   */
  const handleSubmitXYValues = (selectedXValue, selectedYValue) => {
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
      /*
       * get existing data to be filtered
       * get index of new x and y values within the dataset
       * loop over each item in the existing dataset being passed to the scatterplot
       * reassign x and y values
       */
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(false);
      let existingData = [...clusterInformation];
      const newXValueIndex = Object.values(props.activeDatasetData[0]).indexOf(
        selectedXValue
      );
      const newYValueIndex = Object.values(props.activeDatasetData[0]).indexOf(
        selectedYValue
      );
      let wrapper = [];
      existingData.forEach((series) => {
        let newSeries = cloneDeep(series);
        newSeries.data.forEach((d) => {
          d.x = parseFloat(d[newXValueIndex]);
          d.y = parseFloat(d[newYValueIndex]);
        });
        wrapper.push(newSeries);
      });

      setClusterInformation(wrapper);
    }
  };
  
  /**
   * * function to load density plots for all columns in the dataset
   * recalls api 
   */
  const handleLoadAllColumns = () => {
    setLoadingDensityPlots(true);
    setLimit(selectedColumns.length);
  };

  const handleGenerateClustorColor = (cluster, targetCluster) => {
    /*
     * if targetCluster === -1 and it is equal to cluster
     * return #f34f34 for now
     * else if check if targetCluster is equal to cluster, and return appropriate color of color_palette
     * else return gray
     */
    if (targetCluster == cluster && targetCluster == -1) {
      return '#000';
    } else if (targetCluster === cluster && targetCluster != -1) {
      return color_palette[cluster];
    } else {
      return 'rgba(224,224,224,.75)';
    }
  };

  /**
   * @param  {object} res from API
   * Helper function to get the most different columns
   */
  const handleGetTargetColumns = (res) => {
    setError(null);
    const data = res.data.sort((a, b) => b.score - a.score);

    let topThreeColumns = [];

    const columns = data.map((col) => col.column);
    columns.forEach((column) => {
      if (column !== '0') {
        topThreeColumns.push(column);
      }
    });
    setSelectedColumns(topThreeColumns);
  };

  /**
   * * UseEffect hook to call cluster-exploration api
   * returns the most different columns in the dataset
   */
  useEffect(() => {
    if (targetModelID) {
      setError(null);
      setLoadingDensityPlots(true);
      let tempTargetCluster = props.routeProps.match.params.id.slice(-2);
      let targetCluster;
      if (tempTargetCluster == '-1') {
        targetCluster = -1;
      } else {
        targetCluster = parseInt(
          props.routeProps.match.params.id.replace(/^\D+/g, '')
        );
      }
      setViolinPlotData([]);
      setAllOtherClustersDataForViolin([]);
      setTargetCluster(targetCluster);
      const url = `https://clusterexploration-gov.azurewebsites.net/most_diff_columns_one_cluster_vs_rest?&modelID=${targetModelID}&cluster=${targetCluster}`;
      axios
        .post(
          url,
          {},
          {
            headers: {
              'api-key': 'f023383b4a214a3a9096b04aaab0aa67',
              'Access-Control-Allow-Origin': '*'
            },
          }
        )
        .then((res) => handleGetTargetColumns(res))
        .catch((error) => setError(error));
    }
  }, [props.routeProps.match.params.id, targetModelID]);

  useEffect(() => {
    const uniqueClusters = clusterColumns
      .map((item) => item['0'])
      .filter((value, index, self) => self.indexOf(value) === index);

    const columnHeaders = Object.values(props.activeDatasetData[0]);
    setColumnHeaders(columnHeaders);
    let integerOnlyColumnNames = [];
    columnHeaders.forEach((column) => {
      const indexOfColumn = Object.values(props.activeDatasetData[0]).indexOf(column);
      if (!isNaN(props.activeDatasetData[1][indexOfColumn]) && props.activeDatasetData[1][indexOfColumn]) {
        integerOnlyColumnNames.push(column);
      }
    }); 
    setIntegerOnlyColumnNames(integerOnlyColumnNames);
    let clustersWrapper = [];
    let joined = [];
    for (let i = 0; i < clusterColumns.length; i++) {
      let joinedObj = {
        ...coordinates[i],
        ...props.activeDatasetData[i],
        cluster: clusterColumns[i][0],
      };
      joined.push(joinedObj);
    }

    let tempTargetCluster = props.routeProps.match.params.id.slice(-2);
    let targetCluster;
    if (tempTargetCluster == '-1') {
      targetCluster = -1;
    } else {
      targetCluster = parseInt(
        props.routeProps.match.params.id.replace(/^\D+/g, '')
      );
    }
    setTargetCluster(targetCluster);

    const tableData = joined.filter((row) => row.cluster === targetCluster);
    setTableData(tableData);
    let checkedClusters = [];

    uniqueClusters.forEach((cluster) => {
      handleGenerateClustorColor(cluster, targetCluster);
    });

    uniqueClusters.forEach((cluster, index) => {
      let filteredObject = joined.filter(
        (obj) => obj.cluster === targetCluster
      );
      let wrapper = {
        name: `Cluster ${cluster}`,
        color: color_palette[targetCluster],
        marker: {
          symbol: 'circle',
        },
        data: filteredObject,
        checked: false,
      };

      clustersWrapper.push(wrapper);
    });
    setClusterInformation(clustersWrapper);
    setOriginalClusterInformation(cloneDeep(clustersWrapper));
  }, [coordinates, clusterColumns, props.routeProps.match.params.id]);

  const handleSelectActiveCluster = (cluster) => {
    setActiveCluster(cluster);
    props.routeProps.history.push(`/cluster/${cluster}`);
  };

  useEffect(() => {
    const existingClusterInformation = cloneDeep(originalClusterInformation);
    let tempTargetCluster = props.routeProps.match.params.id.slice(-2);
    let targetCluster;
    if (tempTargetCluster == '-1') {
      targetCluster = -1;
    } else {
      targetCluster = parseInt(
        props.routeProps.match.params.id.replace(/^\D+/g, '')
      );
    }
    if (clusterInformation.length > 0) {
      if (!showAllOtherClusters) {
        const filteredData = existingClusterInformation.filter(
          (series) => series.name === targetCluster
        );
        setClusterInformation(filteredData);
      } else {
        setClusterInformation(existingClusterInformation);
      }
    }
  }, [showAllOtherClusters]);

  const handleToggleShowTooltipToggle = () => {
    setShowTooltip(!showToolTip);
  };

  const handleToggleShowAllClustersTooltip = () => {
    setShowAllOtherClusters(!showAllOtherClusters);
  };
  if (
    props.allClusterNames.length === 0 ||
    clusterInformation.length === 0 ||
    tableData.length === 0
  ) {
    // ClusterDetailsSkeleton
    return (
      <div className="entire-content">
        <Sidebar
          clusters={props.allClusterNames}
          activeCluster={props.routeProps.match.params.id}
          activePage={'cluster'}
          handleSelectActiveCluster={handleSelectActiveCluster}
        ></Sidebar>
        <div className="main-content">
          <ClusterDetailsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="entire-content">
      <Sidebar
        clusters={props.allClusterNames}
        activeCluster={props.routeProps.match.params.id}
        activePage={'cluster'}
        handleSelectActiveCluster={handleSelectActiveCluster}
      ></Sidebar>
      <div className="main-content">
        <h1 className="cluster-details-title">
          {props.routeProps.match.params.id} Details
        </h1>
        <h3 className="cluster-details-subtitle">
          Cluster generated by {props.activeModelClusterExploration}
        </h3>
        <div>
          <ClusterDetailsActions
            showAllOtherClusters={showAllOtherClusters}
            integerOnlyColumnNames={integerOnlyColumnNames}
            selectedYValueIsNull={selectedYValueIsNull}
            selectedXValueIsNull={selectedXValueIsNull}
            handleSubmitXYValues={handleSubmitXYValues}
            handleResetData={handleResetData}
            firstRowOfData={props.activeDatasetData[0]}
            showToolTip={showToolTip}
            handleToggleShowAllClustersTooltip={
              handleToggleShowAllClustersTooltip
            }
            handleToggleShowTooltipToggle={handleToggleShowTooltipToggle}
          />
        </div>

        <Alert />
        <div className="cluster-details-chart-and-metrics-wrapper">
          <div className="cluster-details-scatterplot-wrapper">
            <Scatterplot
              chartData={clusterInformation}
              columnHeaders={columnHeaders}
              isClusterDetailsPage={true}
              showToolTip={showToolTip}
            />
          </div>
          <div className="cluster-details-metrics-wrapper">
            <ClusterMetrics />
          </div>
        </div>

        {(() => {
          if (loadingDensityPlots) { // loadingDensityPlots
            return <ClusterTableLoading clusterTableLoadingCopy={`Comparing Cluster ${targetCluster} to the rest of the dataset by Column`} />;
          } 
          else if (error) {
            return (
              <ClusterTableError error={error.message} />
            );
          }
          else if (densityPlotImages.length > 0) {
            return (
              <div className='cluster-details-density-plot-section'>
                <div className='cluster-details-density-plot-section__header'>
                  <h1>See data features with significant differences in your clusters below.</h1>
                  <h3>Each density plot represents <span>Cluster {targetCluster}</span> compared with the rest of the dataset for a specific column.</h3>
                </div>
                <div className='cluster-details-density-plot-wrapper'>
                  {densityPlotImages.map((image, index) => {
                    return (
                      <div key={index} className='cluster-details-density-plot'>
                        <h1 className='cluster-details-density-plot__title'>Column: <span>{image.column}</span></h1>
                        <img src={`data:image/png;base64,${image.imageString}`} />
                      </div>
                    );
                  })}
                </div>
                {limit === selectedColumns.length ? null : (
                  <Button
                    onClick={handleLoadAllColumns}
                    className="load-all-columns-button"
                    variant={'contained'}
                    color={'primary'}
                  >
                    Load All Columns in Dataset
                  </Button>
                )}
              </div>
            );
          } else {
            return <ClusterTableLoading clusterTableLoadingCopy={`Comparing Cluster ${targetCluster} to the rest of the dataset by Column`} />;
          }
        })()}
        <DataTable
          data={tableData}
          selectedClusters={[]}
          isClusterDetailsPage={true}
          targetCluster={targetCluster}
        />
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(ClusterDetails);

ClusterDetails.propTypes = {
  routeProps: PropTypes.object,
  allClusterNames: PropTypes.array,
  selectedDataset: PropTypes.object,
  activeDatasetData: PropTypes.array,
  activeModelClusterExploration: PropTypes.string,
};
