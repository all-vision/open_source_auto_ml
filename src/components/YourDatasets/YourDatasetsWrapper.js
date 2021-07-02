/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import DatasetsTable from './DatasetsTable';
import UploadDataModal from './UploadDataModal';
import ProjectDetailsHeader from './YourDatasetsHeader';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  addDataset,
  clearDatasets,
  datasetId,
  selectDataset,
  addUserId,
  setActiveDatasetData,
  setActiveModel,
  setAllModelNames,
  setTotalDataUsage,
  trackOriginalDatasetSize,
} from '../../redux/actions/index';
import TooManyBytesAlert from './TooManyBytesAlert';
import PropTypes from 'prop-types';
import RunningModelZoo from './RunningModelZoo/RunningModelZoo';
import { useQuery, gql, useSubscription, useMutation } from '@apollo/client';
import YourDatasetsSkeleton from './YourDatasetsSkeleton';
import APIError from '../Shared/APIError';
import UploadingDataScreen from './UploadingDataScreen';
import DatasetTooBigModal from './DatasetTooBigModal';
// import '../../styles/ProjectDetails/project-details-wrapper.css';
import '../../styles/YourDatasets/your-datasets-wrapper.css';
import '../../styles/page.css';

// grab redux actions
const mapDispatchToProps = (dispatch) => {
  return {
    addDataset: (dataset) => dispatch(addDataset(dataset)),
    datasetId: (dataset) => dispatch(datasetId(dataset)),
    selectDataset: (dataset) => dispatch(selectDataset(dataset)),
    clearDatasets: () => dispatch(clearDatasets()),
    addUserId: (userId) => dispatch(addUserId(userId)),
    setActiveDatasetData: (data) => dispatch(setActiveDatasetData(data)),
    setActiveModel: (model) => dispatch(setActiveModel(model)),
    setAllModelNames: (models) => dispatch(setAllModelNames(models)),
    setTotalDataUsage: (totalDataUsage) =>
      dispatch(setTotalDataUsage(totalDataUsage)),
    trackOriginalDatasetSize: (originalDatasetSize) =>
      dispatch(trackOriginalDatasetSize(originalDatasetSize)),
  };
};

// grab redux state
const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    auth_token: state.auth_token,
    user: state.user,
    userId: state.userId,
    selectedDataset: state.selectedDataset,
  };
};

// graphql query to check when model zoo is done running
// returns array of all existing models
const QUERY_MODEL_ZOO = gql`
  query($DatasetID: _uuid) {
    ModelsTable(where: { DatasetID: { _eq: $DatasetID } }) {
      DatasetID
      ModelHyperparameters
      ModelID
      ModelName
      ModelScores
      ClusteringColumn
    }
  }
`;

// queries active user by their UserID which lives in redux
// returns one user
const QUERY_ACTIVE_USER = gql`
  subscription($UserID: Int) {
    UsersTable(where: { UserID: { _eq: $UserID } }) {
      Company
      DatasetIDs
      DeployedModels
      JoinedDate
      Name
      UserID
      Email
      ActiveSubscriptions
      ApiKey
    }
  }
`;

const QUERY_ACTIVE_USER_USAGE = gql`
  subscription($UserID: Int) {
    UsersTable(where: { UserID: { _eq: $UserID } }) {
      Usage
    }
  }
`;

const UPDATE_USER_DATASETS = gql`
  mutation($UserID: Int, $DatasetIDs: _uuid) {
    update_UsersTable(
      where: { UserID: { _eq: $UserID } }
      _set: { DatasetIDs: $DatasetIDs }
    ) {
      returning {
        Company
        DatasetIDs
        DeployedModels
        Email
        JoinedDate
        Name
        UserID
        Usage
      }
    }
  }
`;

const UPDATE_USAGE = gql`
  mutation($UserID: Int, $Usage: bigint) {
    update_UsersTable(
      where: { UserID: { _eq: $UserID } }
      _set: { Usage: $Usage }
    ) {
      returning {
        Usage
      }
    }
  }
`;

const DELETE_DATASET = gql`
  mutation($DatasetIDRef: uuid) {
    delete_DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
      affected_rows
      returning {
        DatasetID
        DatasetIDRef
        DatasetName
        ModelZooIDs
        Size
        UploadDate
        Original
        Location
      }
    }
  }
`;

// const UPDATE_USAGE = gql`
// mutation($UserID: Int, $Usage: Int) {
//   update_usage {
//     affected_rows
//     returning {

//     }
//   }
// }
// `

// query to load all users from database
// returns array of all existing users
const QUERY_ALL_USERS = gql`
  subscription {
    UsersTable {
      Company
      DatasetIDs
      DeployedModels
      JoinedDate
      Name
      UserID
      Email
    }
  }
`;

// query to receive all of the active users' datasets
// requires userIs from redux, and all of the dataset id's that belong to their account
const QUERY_USERS_DATASETS = gql`
  subscription($DatasetIDRef: [uuid]) {
    DatasetsTable(
      order_by: { UploadDate: asc }
      where: { DatasetIDRef: { _in: $DatasetIDRef } }
    ) {
      UploadDate
      Size
      Original
      ModelZooIDs
      Location
      DatasetName
      DatasetIDRef
      DatasetID
    }
  }
`;

function YourDatasetsWrapperFunc(props) {
  const [bytesLimitExceeded, setBytesLimitedExceeded] = useState(false);
  const [existingFileSize, setExistingFileSize] = useState(0);
  const [uploadDataModalIsOpen, setUploadDataModalIsOpen] = useState(false);
  const [combineDatasetsModalIsOpen, setCombineDatasetsModalIsOpen] = useState(
    false
  );
  const [activePage, setActivePage] = useState('datasets');
  const [activeUserDatasetIds, setActiveUserDatasetIds] = useState([]);
  const [sampleFiles] = useState({
    DatasetID: 988,
    DatasetIDRef: 'ec0fa8d1-c5b9-4d83-b457-3d248d9f3669',
    DatasetName: 'heart.csv',
    Location: 'user-datasets',
    ModelZooIDs: null,
    Original: true,
    Size: 11325,
    UploadDate: '2021-06-25T12:55:56.330832+00:00',
    __typename: 'DatasetsTable',
  });
  const [activeFiles, setActiveFiles] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [fileBeingUploaded, setFileBeingUploaded] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [currentDatasetIDRef, setCurrentDatasetIDRef] = useState(null);
  const [currentDatasetID, setCurrentDatasetID] = useState(null);
  const [modelZooIsRunning, setModelZooIsRunning] = useState(false);
  const [updateUsersDatasetIds] = useMutation(UPDATE_USER_DATASETS);
  const [deleteDataset] = useMutation(DELETE_DATASET);
  const [processingData, setProcessingData] = useState(false);
  const [uploadingData, setUploadingData] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [usage, setUsage] = useState(0);
  const [updateUsersUsage] = useMutation(UPDATE_USAGE);
  const [apiError, setApiError] = useState({
    error: false,
    errorMessageText: 'something went wrong',
  });
  const [datasetTooLarge, setDatasetTooLarge] = useState(false);

  // load all users
  // returns array of all users
  const USERS = useSubscription(QUERY_ALL_USERS);

  // load active user based on their userId which is passed in from redux
  const ACTIVE_USER = useSubscription(QUERY_ACTIVE_USER, {
    variables: { UserID: props.userId },
  });

  const ACTIVE_USER_USAGE = useSubscription(QUERY_ACTIVE_USER_USAGE, {
    variables: { UserID: props.userId},
  });

  const USERS_DATASETS = useSubscription(QUERY_USERS_DATASETS, {
    variables: { DatasetIDRef: activeUserDatasetIds },
  });

  // query to make sure that /embed route ran and coordinates have been generated for scatterplots
  // make sure coordinates exist before sending user to model zoo page
  const GET_COORDINATES = gql`
    query($DatasetIDRef: uuid) {
      DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
        Coordinates
      }
    }
  `;

  // make sure that models exist before sending users to model zoo page
  const MODEL_ZOO_RAN = useQuery(QUERY_MODEL_ZOO, {
    variables: { DatasetID: currentDatasetIDRef },
    pollInterval: 500,
  });

  const COORDINATES_EXIST = useQuery(GET_COORDINATES, {
    variables: { DatasetIDRef: currentDatasetID },
    pollInterval: 1000,
  });

  useEffect(() => {
    if (ACTIVE_USER_USAGE.data) {
      setUsage(ACTIVE_USER_USAGE.data.UsersTable[0].Usage);
    }
  }, [ACTIVE_USER_USAGE]);

  useEffect(() => {
    if (currentDatasetIDRef) {
      // check that there is an active dataset
      if (!MODEL_ZOO_RAN.loading && !COORDINATES_EXIST.loading) {
        if (MODEL_ZOO_RAN.data && COORDINATES_EXIST.data) {
          if (
            MODEL_ZOO_RAN.data.ModelsTable &&
            COORDINATES_EXIST.data.DatasetsTable[0].Coordinates
          ) {
            if (
              MODEL_ZOO_RAN.data.ModelsTable.length > 0 &&
              COORDINATES_EXIST.data.DatasetsTable[0].Coordinates.length > 0
            ) {
              setUploadingData(false);
              setTimeout(() => {
                setModelZooIsRunning(false); // check when file is finished being uploaded / model zoo generated points and models
                setFileBeingUploaded(null);
              }, 3000);
            }
          }
        }
      }
    }
  }, [MODEL_ZOO_RAN, COORDINATES_EXIST]);

  // store all users in react state
  useEffect(() => {
    if (!USERS.loading) {
      setUsers(USERS.data.UsersTable);
    }
  }, [USERS]); // run useEffect everytime the USERS result changes

  useEffect(() => {
    // make sure the users' datasets have laoded and no errors exist
    if (!USERS_DATASETS.loading && !USERS_DATASETS.error) {
      // set skeleton loading screen while state is being updated with users' datasets
      setShowSkeleton(true);
      // load users' datasets into state
      let realFiles = [sampleFiles, ...USERS_DATASETS.data.DatasetsTable];
      setActiveFiles(USERS_DATASETS.data.DatasetsTable);
      // remove skeleton loading screen
      setShowSkeleton(false);
    }
  }, [USERS_DATASETS]);

  useEffect(() => {
    if (!ACTIVE_USER.loading && !ACTIVE_USER.error) {
      if (ACTIVE_USER.data) {
        let targetUserDatasetIds = ACTIVE_USER.data.UsersTable[0].DatasetIDs;
        setActiveUserDatasetIds(targetUserDatasetIds);
      }
    }
  }, [ACTIVE_USER]);

  useEffect(() => {
    // make sure that user is properly authenticated
    // if no auth token exists kick them out to the not authorized page
    if (!props.auth_token) {
      props.routeProps.history.push('/notauthorized');
      return;
    }
  }, [activeUserDatasetIds, allDatasets]);

  useEffect(() => {
    if (lastAction === 'delete_file') {
      return;
    }

    // calculate the total MB usage of each user by adding up all of their active file sizes
    let tempExistingSize = 0;
    activeFiles.forEach((file) => {
      tempExistingSize += file.Size;
    });

    // store this information in state and redux
    // this information is used on the datasets and settings page
    setExistingFileSize(tempExistingSize);
    props.setTotalDataUsage(usage);
  }, [usage]); // run whenever a dataset is added or deleted

  // load once when page loads and authenticate user
  useEffect(() => {
    // make sure that user is properly authenticated
    // if no auth token exists kick them out to the not authorized page
    if (!props.auth_token) {
      props.routeProps.history.push('/notauthorized');
      return;
    }

    // grab auth_token from redux store
    const auth_token = props.auth_token.SessionToken;
    const config = {
      headers: { Authorization: `Bearer ${auth_token}` },
    };

    const bodyParameters = {
      key: 'value',
    };

    // call check-token api to validate the user's session token
    axios
      .post(
        'https://govoracle.azurewebsites.net/check-token',
        // 'https://allvisionflask.azurewebsites.net/check-token', --original
        bodyParameters,
        config
      )
      .then((res) => {
        handleAuthenticationResult(res);
        console.log(res);
      })
      .catch((error) => handleAuthenticationFailed());
  }, []);

  const handleAuthenticationResult = (res) => {
    const message = res.data.message;
    if (message === 'Invalid session token.') {
      alert('FAILURE');
      props.routeProps.history.push('/notauthorized');
      return;
    }
  };

  const handleAuthenticationFailed = (error) => {
    // alert(error);
    props.routeProps.history.push('/notauthorized');
    return;
    // alert(error);
  };

  // open alert if user has uploaded more that 50MB worth of data
  const handleCloseTooManyBytesAlert = () => {
    setBytesLimitedExceeded(false);
  };

  // set upload data modal to be open
  const handleUploadDataModalOpen = () => {
    setUploadDataModalIsOpen(true);
  };

  // set upload data modal to be closed
  const handleUploadDataModalClose = () => {
    setUploadDataModalIsOpen(false);
  };

  // const handleCombineDatasetsModalOpen = () => {
  //   setCombineDatasetsModalIsOpen(true);
  // };

  // const handleCombineDatasetsModalClose = () => {
  //   setCombineDatasetsModalIsOpen(false);
  // };

  // function to handle deleting a dataset
  // takes in the index of the table row that is being deleted
  const handleDeleteDataset = (index) => {
    let exitingDatasets = activeFiles;
    let targetFile = exitingDatasets[index];

    // if the user deletes the current selected file, set selectedFile to null
    if (props.selectedDataset) {
      if (targetFile.DatasetIDRef === props.selectedDataset.DatasetIDRef) {
        props.selectDataset(null);
      }
    }

    let existingUserDatasetIds = activeUserDatasetIds;
    let datasetIdIndex = existingUserDatasetIds.indexOf(
      targetFile.DatasetIDRef
    );

    if (datasetIdIndex > -1) {
      existingUserDatasetIds.splice(datasetIdIndex, 1);
    }
    // format data to be sent to postgres database via Hasura
    let formattedDatasetString = '';
    existingUserDatasetIds.forEach((dataset) => {
      formattedDatasetString += `${dataset},`;
    });

    let newString =
      '{' +
      formattedDatasetString.substring(0, formattedDatasetString.length - 1) +
      '}';

    setActiveUserDatasetIds(existingUserDatasetIds);

    // update dataset ids on the user's table
    updateUsersDatasetIds({
      variables: {
        UserID: props.userId,
        DatasetIDs: newString,
      },
    });

    // delete target dataset from the datasets table
    deleteDataset({ variables: { DatasetIDRef: targetFile.DatasetIDRef } });
    setLastAction('delete_file');
  };

  // runs when model zoo is finished running
  const handleRedirectUserToModelZoo = () => {
    props.routeProps.history.push('/unsupervised');
    setShowLoadingScreen(false);
  };

  // get data from azure blob storage
  const handleProcessData = (file) => {
    props.setActiveDatasetData(null);
    props.handleSelectDataset(file);
    // toggle loading screens while data is being processed
    setShowLoadingScreen(true);
    setProcessingData(true);
    axios({
      method: 'post',
      url: ' https://allvisiongov.azurewebsites.net/data',
      data: { filename: file.DatasetIDRef },
    }).then(
      (response) => {
        // store data in redux state
        // data is user on the model zoo page and on the model details page
        props.setActiveDatasetData(response.data);
        const originalDatasetSize = {
          rows: response.data.length,
          column: Object.keys(response.data[0]).length,
        };
        props.trackOriginalDatasetSize(originalDatasetSize);
        setProcessingData(false);
      },
      (error) => {
        console.log(error.response);
        setApiError({
          error: true,
          errorMessageText: error,
        });
      }
    );
  };

  // function runs model zoo
  // takes in res object from handleDataUpload function
  // takes in newFile object containing information about the newly updated file
  const handleUploadDatasetSuccess = (res, newFile) => {
    setShowUploadProgress(false);
    // setUploadingData(true);
    // setModelZooIsRunning(true);
    console.log(res);
    if (!res.data.dataset_uuid) {
      alert('something went wrong whilst uploading your data');
      return;
    }

    // grab datasetId for the file being uploaded
    const newDatasetId = res.data.dataset_uuid;
    let newString = '{' + newDatasetId + '}';
    setCurrentDatasetIDRef(newString);
    setCurrentDatasetID(newDatasetId);

    // call /embed which generates coordinates for scatterplots
    // populates coordinates column with Array of Objects:  [{x: 1, y: 1}, {x: 2, y: 2}]
    // returns status message (200 for success, 500 for error, etc)
    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/embed',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        setApiError({
          error: true,
          errorMessageText: error,
        });
        console.warn('error: ', error);
      }
    );

    // runs kmeans model
    // adds kmeans to ModelsTable in database
    // returns status message (200 for success, 500 for error, etc)
    axios({
      method: 'post',
      // url: 'https://allvisionmodels.azurewebsites.net/kmeans',
      url: 'https://allvisiongov.azurewebsites.net/kmeans',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    // runs agglomerative model
    // adds agglomerative to ModelsTable in database
    // returns status message (200 for success, 500 for error, etc)
    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/agglomerative',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    // same as other models above ^
    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/dbscan',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/birch',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/optics',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/hdbscan',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/weighted',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/median',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/average',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/complete',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    axios({
      method: 'post',
      url: 'https://allvisiongov.azurewebsites.net/single',
      data: { filename: newDatasetId },
    }).then(
      (response) => {
        console.log('response: ', response);
      },
      (error) => {
        console.warn('error: ', error);
      }
    );

    const existingFiles = activeFiles;
    existingFiles.push(newFile);
    let newActiveUserDatasetIds;
    if (activeUserDatasetIds) {
      newActiveUserDatasetIds = [...activeUserDatasetIds, newDatasetId];
    } else {
      newActiveUserDatasetIds = newDatasetId;
    }

    setActiveUserDatasetIds(newActiveUserDatasetIds);
  };
  /**
   * * function to close modal that appears when dataset is too large
   * * sets state
   * * is passed down as a prop to DatasetTooBigModal
   */
  const handleCloseDatasetTooBigModal = () => {
    setDatasetTooLarge(false);
  };

  // QUERY_DATASETS
  // handles dataset being uploaded
  // takes in dataset and file
  const handleUploadDataset = (dataset, file) => {
    if (file.size >= 15000000) {
      setDatasetTooLarge(true);
      return;
    }
    // create array of all rows in the dataset
    let d = [];
    dataset.forEach((datum) => {
      d.push(datum.data);
    });

    // updateUsersDatasetIds({
    //   variables: {
    //     UserID: props.userId,
    //     DatasetIDs: newString,
    //   },
    // });

    // props.setTotalDataUsage(newTotalFileSize);

    // check if the size of existing files + the new uploaded file will be greater than 50MB
    if (usage + file.size > 50000000) {
      setBytesLimitedExceeded(true);
    } else {
      setLastAction('add_file');
      updateUsersUsage({
        variables: {
          UserID: props.userId,
          Usage: usage + file.size,
        },
      });
      // add new size of file to existing file size to track how much data the user has uploaded
      const newFileSize = file.size;
      const newTotalFileSize = existingFileSize + newFileSize;
      setExistingFileSize(newTotalFileSize);
      // generate new object to represent uploaded file
      const newFile = {
        UserID: props.userId, // userId
        fileType: 'csv', // type of file (csv only for now)
        fileName: file.name, // filename...
        fileSize: file.size, // size of file in bytes
        UploadDate: new Date().toLocaleString(), // date of when file was uploaded, string I think
        data: d, // list of dictionaries, containing actual information for the file
      };
      setFileBeingUploaded({
        fileName: newFile.fileName,
        fileType: newFile.fileType,
        fileRows: newFile.data.length,
        fileColumns: newFile.data[0].length,
        fileSize: newFile.fileSize,
      });
      addDataset(newFile);

      // toggle loading screen while file is being uploaded
      setUploadingData(true);
      setModelZooIsRunning(true);
      // send data to be stored in the backend

      axios({
        method: 'post',
        url: 'https://oilrig.azurewebsites.net/api/upload',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: newFile,
      })
        /*
          pass in result from API and new file to handleUploadDataSuccess function
          which will run the model zoo on the uploaded file
          */
        .then((res) => {
          console.log(res);
          handleUploadDatasetSuccess(res, newFile);
        })
        .catch((e) => console.log('e: ', e));

      // setFiles([...files, newFile]);
      setBytesLimitedExceeded(false);
    }
  };

  // function runs when user clicks on a model name
  const handleSelectActiveModel = (model) => {
    props.setActiveModel(model);
    props.routeProps.history.push(`/modeldetails/${model.ModelName}`);
  };

  // if data is being uploaded show loading screen
  if (modelZooIsRunning) {
    // return <LoadingScreen />;
    return (
      <UploadingDataScreen
        fileBeingUploaded={fileBeingUploaded}
        uploadingData={uploadingData}
      />
    );
  }

  // if model zoo is running show loading screen
  if (showLoadingScreen) {
    return (
      <RunningModelZoo
        processingData={processingData}
        handleRedirectUserToModelZoo={handleRedirectUserToModelZoo}
      ></RunningModelZoo>
    );
  }

  // if USERS_DATASETS query is still loading data, show user the skeleton component
  // else if everything is loaded, render the rest of the components
  let content = null;
  if (USERS_DATASETS.loading) {
    content = <YourDatasetsSkeleton />;
  } else {
    content = (
      <>
        <UploadDataModal
          handleUploadDataModalOpen={handleUploadDataModalOpen}
          handleUploadDataModalClose={handleUploadDataModalClose}
          uploadDataModalIsOpen={uploadDataModalIsOpen}
          handleUploadDataset={handleUploadDataset}
        />
        <DatasetTooBigModal
          datasetTooLarge={datasetTooLarge}
          handleCloseDatasetTooBigModal={handleCloseDatasetTooBigModal}
        />
        <div className='project-details-left-side'>
          <ProjectDetailsHeader
            handleUploadDataModalOpen={handleUploadDataModalOpen}
            selectedDataset={props.selectedDataset}
            existingFileSize={existingFileSize}
            usage={usage}
          />
          {/* render alert is user has uploaded more than 50MB worth of data */}
          {bytesLimitExceeded ? (
            <TooManyBytesAlert
              handleCloseTooManyBytesAlert={handleCloseTooManyBytesAlert}
            />
          ) : null}
          <DatasetsTable
            // files={files}
            // loading={loading}
            // activeFiles={
            //   USERS_DATASETS.data ? USERS_DATASETS.data.DatasetsTable : []
            // }]
            activeFiles={activeFiles}
            handleSelectDataset={props.handleSelectDataset}
            handleProcessData={handleProcessData}
            selectDataset={props.selectDataset}
            handleDeleteDataset={handleDeleteDataset}
          />
        </div>
      </>
    );
  }

  // if something went wrong with one of our APIs, redirect user to error page
  if (apiError.error) {
    return <APIError apiError />;
  }

  return (
    <div className='entire-content'>
      <Sidebar
        activePage={activePage}
        handleSelectActiveModel={handleSelectActiveModel}
        routeProps={props.routeProps}
        selectedDataset={props.selectedDataset}
      />

      <div className='main-content'>{content}</div>
    </div>
  );
}

// connect function to redux store
// React.memo checks against useless re-renders of the page
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(YourDatasetsWrapperFunc));

YourDatasetsWrapperFunc.propTypes = {
  clearDatasets: PropTypes.func,
  addDataset: PropTypes.func,
  authToken: PropTypes.func,
  handleSelectDataset: PropTypes.func,
  selectedDataset: PropTypes.object,
  selectDataset: PropTypes.func,
  datasetId: PropTypes.func,
  routeProps: PropTypes.object,
  auth_token: PropTypes.object,
  user: PropTypes.object,
  userId: PropTypes.number,
  addUserId: PropTypes.func,
};
