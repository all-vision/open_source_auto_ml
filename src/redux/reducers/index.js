// import DATA from '../../components/ModelDetails/model_details_data';
import { AUTH_USER } from '../constants/action-types';
import { ADD_DATASET } from '../constants/action-types';
import { SELECT_DATASET } from '../constants/action-types';
import { ASSIGN_MODEL_TO_DEB } from '../constants/action-types';
import { CLEAR_DATASETS } from '../constants/action-types';
import { AUTH_TOKEN } from '../constants/action-types';
import { DATASET_ID } from '../constants/action-types';
import { USER_ID } from '../constants/action-types';
import { SET_ACTIVE_DATASET_DATA } from '../constants/action-types';
import { SET_ORIGINAL_CHART_DATA } from '../constants/action-types';
import { SET_ACTIVE_MODEL } from '../constants/action-types';
import { SET_ALL_MODEL_NAMES } from '../constants/action-types';
import { NEW_MODEL_IS_BEING_CREATED } from '../constants/action-types';
import { USER_INFO_FOR_AUTO_LOGIN } from '../constants/action-types';
import { STRIPE_CUSTOMER_ID } from '../constants/action-types';
import { TOTAL_DATA_USAGE } from '../constants/action-types';
import { TRACK_ORIGINAL_DATASET_SIZE } from '../constants/action-types';
import { SET_ALL_CLUSTER_NAMES } from '../constants/action-types';
import { SET_ACTIVE_MODEL_CLUSTER_EXPLORATION } from '../constants/action-types';

const initialState = {
  user: null,
  userInfoForAutoLogin: null,
  auth_token: null,
  activeDatasetData: [],
  originalChartData: [],
  userId: null,
  datasets: [],
  selectedDataset: null,
  datasetId: [],
  activeModel: null,
  totalDataUsage: null,
  stripeCustomerId: null,
  newModelIsBeingCreated: {
    isBeingCreated: false,
    newModelName: ''
  },
  allModelNames: [],
  allClusterNames: [],
  activeModelClusterExploration: 'KMeans ',
  modelAssignedToDEB: {
    name: 'DB Scan'
  },
  originalDatasetSize: {
    columns: null,
    rows: null
  }
};

function rootReducer(state = initialState, action) {

  if (action.type === SET_ACTIVE_MODEL_CLUSTER_EXPLORATION) {
    return Object.assign({}, state, {
      activeModelClusterExploration: action.payload
    });
  }
  
  if (action.type === SET_ALL_CLUSTER_NAMES) {
    return Object.assign({}, state, {
      allClusterNames: action.payload
    });
  }
  
  if (action.type === TRACK_ORIGINAL_DATASET_SIZE) {
    return Object.assign({}, state, {
      originalDatasetSize: action.payload
    });
  }
  
  if (action.type === TOTAL_DATA_USAGE) {
    return Object.assign({}, state, {
      totalDataUsage: action.payload
    });
  }
  
  if (action.type === USER_INFO_FOR_AUTO_LOGIN) {
    return Object.assign({}, state, {
      userInfoForAutoLogin: action.payload
    });
  }
  if (action.type === STRIPE_CUSTOMER_ID) {
    return Object.assign({}, state, {
      stripeCustomerId: action.payload
    });
  }

  if (action.type === NEW_MODEL_IS_BEING_CREATED) {
    return Object.assign({}, state, {
      newModelIsBeingCreated: action.payload
    });
  }
  
  if (action.type === SET_ALL_MODEL_NAMES) {
    return Object.assign({}, state, {
      allModelNames: action.payload
    });
  }

  if (action.type === SET_ACTIVE_MODEL) {
    return Object.assign({}, state, {
      activeModel: action.payload
    });
  }

  if (action.type === SET_ORIGINAL_CHART_DATA)  {
    return Object.assign({}, state, {
      originalChartData: action.payload
    });
  }

  if (action.type === SET_ACTIVE_DATASET_DATA) {
    return Object.assign({}, state, {
      activeDatasetData: action.payload
    });
  }
  
  if (action.type === USER_ID) {
    return Object.assign({}, state, {
      userId: action.payload
    });
  }
  
  if (action.type === DATASET_ID) {
    return Object.assign({}, state, {
      datasetId: [],
    });
  }

  if (action.type === AUTH_TOKEN) {
    return Object.assign({}, state, {
      auth_token: action.payload
    });
  }

  if (action.type === AUTH_USER) {
    return Object.assign({}, state, {
      user: action.payload,
    });
  }

  if (action.type === ADD_DATASET) {
    return Object.assign({}, state, {
      datasets: state.datasets.concat(action.payload),
    });
  }

  if (action.type === SELECT_DATASET) {
    return Object.assign({}, state, {
      selectedDataset: action.payload,
    });
  }

  if (action.type === ASSIGN_MODEL_TO_DEB) {
    return Object.assign({}, state, {
      modelAssignedToDEB: action.payload
    });
  }

  if (action.type === CLEAR_DATASETS) {
    return Object.assign({}, state, {
      datasets: []
    });
  }

  return state;
}

export default rootReducer;
