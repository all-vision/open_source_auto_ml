/* eslint-disable react/prop-types */
import ClusterTableDirections from './ClusterTableDirections';
import ClusterTableLoading from './ClusterTableLoading';
import ClusterTableRow from './ClusterTableRow';
import ClusterTableError from './ClusterTableError';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useQuery, gql, useSubscription } from '@apollo/client';
import { Button } from '@material-ui/core';
import { Base64 } from 'js-base64';
import axios from 'axios';

import '../../../styles/ClusterExploration/cluster-table-wrapper.css';


function ClusterTable(props) {
  /**
   * Props properties
   *
   * cluster: {
   *  name: string
   *  checked: boolean,
   *  color: "rgba()",
   *  data: [Objects]
   * }
   * columnHeaders: Array[string]
   *
   *
   */

  const [clusterList, setClusterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostDiffColumns, setMostDiffColumns] = useState([]);
  const [limit, setLimit] = useState(6);
  const [img, setImg] = useState(null);
  const [imageStrings, setImageStrings] = useState([]);
  const [densityPlotImages, setDensityPlotImages] = useState([]);
  const [pageContent, setPageContent] = useState(null);

  /**
   * UseEffect Method: (this will be removed when we get the data api)
   *
   * If the violin plots are not visible, do not perform data transformations
   *
   * If the violin plots are visible, perform data transformations on props.cluster.data
   * props.cluster.data is an array of javascript objects, with each javacript object being
   * a single datapoint (with certain properties like x,y coords, price, Market Cap, sales etc).
   *
   * Have to convert this data into an 2d array with each array containing the properties for each data
   * i.e.           data1 data2 data3 data4
   *        Price       3     4     4     8
   *        Sales       6     8     9    10
   *
   *
   */

  /**
   * Call API to make
   */

  const getDiffCols = async (url, selectedClusters) => {
    let json = await axios.post(
      url,
      {
        names: selectedClusters,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    var image = new Image();
    // var src = 'data:image/png;base64,';
    let src = json.data;
  
    image.src = src;
    setImg(src);
    const sortedJsonResponse = json.data
      .filter((d) => d.column != '0')
      .sort((a, b) => b.score - a.score)
      .map((obj) => obj.column);

    return sortedJsonResponse;
  };

  const handleLoadAllColumns = () => {
    setLoading(true);
    setLimit(mostDiffColumns.length);
  };

  useEffect(() => {
    if (!props.visible) {
      setImageStrings([]);
    }
  }, [props.visible]);

  useEffect(() => {
    setImageStrings([]);
  }, [props.activeModel]);

  useEffect(() => {
    let content = null;
    if (loading) { // loading
      content = <ClusterTableLoading clusterTableLoadingCopy='Comparing Clusters by Column'/>;
    }
    else if (props.error) { 
      content = <ClusterTableError error={props.error.message} />;
    } 
    else if (imageStrings.length > 0) {
      content = (
        <div className="cluster-table-density-plot-section">
          <div className='cluster-table-density-plot-section__header'>
            <h1>See data features with significant differences in your clusters below.</h1>
          </div>
          <div className='cluster-table-density-plot-wrapper'>
            {
              imageStrings.map((image, index) => {
                return (
                  <div key={index} className='cluster-table-density-plot'>
                    <h1>Column: <span>{image.column}</span></h1>
                    <img src={`data:image/png;base64,${image.imageString}`} />
                  </div>
                );
              } )
            }
          </div>
          {limit === mostDiffColumns.length ? null : (
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
      content = <ClusterTableDirections />;
    }
    
    setPageContent(content);
  }, [imageStrings.length, loading, props.error]);

  useEffect(async () => {
    let targetColumns = mostDiffColumns.slice(0, limit);
    let newImageStrings = [];
    const names = props.clusters.map((cluster) => cluster.id);
    // const url = `https://clusterexploration-gov.azurewebsites.net/kde?modelID=${props.activeModelID}&column=${column}`;


    await Promise.all(
      targetColumns.map(async (column) => {
        const url = `https://clusterexploration-gov.azurewebsites.net/kde?modelID=${props.activeModelID}&column=${column}`;
        try {

          
          const response = await axios.post(
            url,
            {
              names: names.sort((a,b) => a-b),
            },
            {}
          );
          
          const apiResponse = await response;
          console.log(apiResponse);
          console.log(response);
          props.logError(null);
          newImageStrings.push({
            imageString: apiResponse.data,
            column: column
          });

        } catch (e) {
          console.log('e: ', e);
          // props.logError(e);
        } 
      })
    );
    setImageStrings(newImageStrings);
    setLoading(false);
  }, [mostDiffColumns, limit]);


  useEffect(async () => {
    /* No data transformation if charts is not visible  */

    if (!props.visible) {
      return;
    }

    setLoading(true);

    /* Transform Data if the charts are visible*/

    const transpose = (m) => m[0].map((_, i) => m.map((x) => x[i]));

    let clusterCopy = [...props.clusters];
    let formmatedClusterCopy = clusterCopy.map((clusterObj) => {
      let data = [...clusterObj.data];

      let dataArr = data.map((dataPoint) => Object.values(dataPoint));

      return {
        ...clusterObj,
        data: transpose(dataArr),
      };
    });

    const selectedClusters = props.clusters.map((cluster) => cluster.id);
    const url = `https://clusterexploration-gov.azurewebsites.net/most_different_columns?modelID=${props.activeModelID}`;
    try {
      let res = await getDiffCols(url, selectedClusters);
      setMostDiffColumns(res);
      props.logError(null);
      setClusterList(formmatedClusterCopy);
    } catch (e) {
      props.logError(e);
      setLoading(false);
    } 
  }, [props.visible, props.clusters]);

  return (
    <>
      {pageContent}
    </>
  );
}

export default ClusterTable;

ClusterTable.propTypes = {
  data: PropTypes.array,
  visible: PropTypes.bool.isRequired,
};
