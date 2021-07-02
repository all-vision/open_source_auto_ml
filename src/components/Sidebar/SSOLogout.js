import React, { useState } from 'react';
import { useGoogleLogout } from 'react-google-login';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import LogoutSnackbar from './LogoutSnackbar.tsx';
import {
  authenticateUser,
  authToken,
  addUserId,
  selectDataset,
  setActiveDatasetData,
  setActiveModel,
  setAllModelNames,
  datasetId,
  setOriginalChartData,
  newModelIsBeingCreated
} from '../../redux/actions/index';
import '../../styles/sso-logout.css';

const clientId =
  '726398650445-erqqgk3pq24ut03irqpmghh9inda9c57.apps.googleusercontent.com';

function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: (user) => dispatch(authenticateUser(user)),
    authToken: (token) => dispatch(authToken(token)),
    addUserId: (userId) => dispatch(addUserId(userId)),
    selectDataset: (dataset) => dispatch(selectDataset(dataset)),
    setActiveDatasetData: (dataset) => dispatch(setActiveDatasetData(dataset)),
    setActiveModel: (model) => dispatch(setActiveModel(model)),
    setAllModelNames: (models) => dispatch(setAllModelNames(models)),
    datasetId: (datasetids) => dispatch(datasetId(datasetids)),
    setOriginalChartData: (data) => dispatch(setOriginalChartData(data)),
    newModelIsBeingCreated: (bool) => dispatch(newModelIsBeingCreated(bool))
  };
}

const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    user: state.user,
    auth_token: state.auth_token,
  };
};

function LogoutHooks(props) {
  const [showLogoutSnackbar, setShowLogoutSnackbar] = useState(false);

  const onLogoutSuccess = (res) => {
    props.routeProps.history.push('/');
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  const handleLogoutSuccess = (res) => {
    if (res.data.message === 'User logged out successfully.') {
      props.routeProps.history.push('/');
      props.authToken(null);
      props.addUserId(null);
      props.selectDataset(null);
      props.authenticateUser(null);
      props.setActiveDatasetData(null);
      props.setActiveModel(null);
      props.setAllModelNames(null);
      props.datasetId(null);
      props.setOriginalChartData(null);
      props.newModelIsBeingCreated({
        isBeingCreated: false,
        newModelName: ''
      });
    }
  };

  const handleSignOut = () => {
    const user = props.user;

    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    axios
      .post(
        'https://govoracle.azurewebsites.net/logout',
        // 'https://allvisionflask.azurewebsites.net/logout',-Original
        user,
        headers
      )
      .then(
        (res) => 
          setTimeout(function () {
            console.log(res);
            handleLogoutSuccess(res); 
          }, 2000),
        setShowLogoutSnackbar(true))
      .catch((e) => console.log('e: ', e));

  };

  // return (
  //   <LogoutSnackbar></LogoutSnackbar>
  // );
  return (
    <>
      <LogoutSnackbar showLogoutSnackbar={showLogoutSnackbar}></LogoutSnackbar>
      <Button
        onClick={handleSignOut}
        className="sso-logout-button"
        color="primary"
      >
        Sign Out
      </Button>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutHooks);

LogoutHooks.propTypes = {
  routeProps: PropTypes.object,
  user: PropTypes.object,
  authToken: PropTypes.func,
  addUserId: PropTypes.func,
  authenticateUser: PropTypes.func,
  selectDataset: PropTypes.func,
  setActiveDatasetData: PropTypes.func,
  setActiveModel: PropTypes.func,
  setAllModelNames: PropTypes.func,
  datasetId: PropTypes.func,
  setOriginalChartData: PropTypes.func,
  newModelIsBeingCreated: PropTypes.func
};
