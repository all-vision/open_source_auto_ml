import {
  AUTH_USER,
  ADD_DATASET,
  SELECT_DATASET,
  ASSIGN_MODEL_TO_DEB,
  CLEAR_DATASETS,
  AUTH_TOKEN,
  DATASET_ID,
  USER_ID,
  SET_ACTIVE_DATASET_DATA,
  SET_ORIGINAL_CHART_DATA,
  SET_ACTIVE_MODEL,
  SET_ALL_MODEL_NAMES,
  NEW_MODEL_IS_BEING_CREATED,
  STRIPE_CUSTOMER_ID,
  USER_INFO_FOR_AUTO_LOGIN,
  TOTAL_DATA_USAGE,
  TRACK_ORIGINAL_DATASET_SIZE,
  SET_ACTIVE_MODEL_CLUSTER_EXPLORATION,
  SET_ALL_CLUSTER_NAMES
} from '../constants/action-types';

export function setActiveModelClusterExploration(payload) {
  return {type: SET_ACTIVE_MODEL_CLUSTER_EXPLORATION, payload};
}

export function setAllClusterNames(payload) {
  return {type: SET_ALL_CLUSTER_NAMES, payload};
}

export function trackOriginalDatasetSize(payload) {
  return {type: TRACK_ORIGINAL_DATASET_SIZE, payload};
}

export function setTotalDataUsage(payload) {
  return {type: TOTAL_DATA_USAGE, payload};
}

export function setStripeCustomerId(payload) {
  return {type: STRIPE_CUSTOMER_ID, payload};
}

export function newModelIsBeingCreated(payload) {
  return {type: NEW_MODEL_IS_BEING_CREATED, payload};
}

export function setAllModelNames(payload) {
  return {type: SET_ALL_MODEL_NAMES, payload};
}

export function setActiveModel(payload) {
  return {type: SET_ACTIVE_MODEL, payload};
}

export function setOriginalChartData(payload) {
  return {type: SET_ORIGINAL_CHART_DATA, payload};
}

export function setActiveDatasetData(payload) {
  return {type: SET_ACTIVE_DATASET_DATA, payload};
}

export function addUserId(payload) {
  return { type: USER_ID, payload };
}

export function authenticateUser(payload) {
  return { type: AUTH_USER, payload };
}

export function addDataset(payload) {
  return { type: ADD_DATASET, payload };
}

export function selectDataset(payload) {
  return { type: SELECT_DATASET, payload };
}

export function assignModelToDEB(payload) {
  return { type: ASSIGN_MODEL_TO_DEB, payload };
}

export function clearDatasets(payload) {
  return { type: CLEAR_DATASETS, payload };
}

export function authToken(payload) {
  return { type: AUTH_TOKEN, payload };
}

export function datasetId(payload) {
  return { type: DATASET_ID, payload };
}

export function addUserInfoForAutoLogin(payload) {
  return {type: USER_INFO_FOR_AUTO_LOGIN, payload};
}