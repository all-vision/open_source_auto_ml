/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
// import SSOLogout from '../Sidebar/SSOLogout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
// import LogoutSnackbar from './LogoutSnackbar.tsx';
import LogoutSnackbar from '../Sidebar/LogoutSnackbar.tsx';
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
  newModelIsBeingCreated,
  setStripeCustomerId,
  setTotalDataUsage,
} from '../../redux/actions/index';

/*
 * map actions to props from redux
 * we will reset a lot of the redux store when a user logs out
 */

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
    newModelIsBeingCreated: (bool) => dispatch(newModelIsBeingCreated(bool)),
    setStripeCustomerId: (id) => dispatch(setStripeCustomerId(id)),
    setTotalDataUsage: (totalDataUsage) =>
      dispatch(setTotalDataUsage(totalDataUsage)),
  };
}

/*
 * map redux state to props
 */
const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    user: state.user,
    auth_token: state.auth_token,
  };
};

/*
 * Component to log a user out
 */
function SettingsLogoutWrapper(props) {
  const [showLogoutSnackbar, setShowLogoutSnackbar] = useState(false);

  /*
   * reset items in Redux store
   * redirect user to login page
   */
  const handleLogoutSuccess = (res) => {
    if (res.data.message === 'User logged out successfully.') {
      props.authToken(null);
      props.addUserId(null);
      props.selectDataset(null);
      props.authenticateUser(null);
      props.setActiveDatasetData(null);
      props.setActiveModel(null);
      props.setAllModelNames(null);
      props.datasetId(null);
      props.setOriginalChartData(null);
      props.setStripeCustomerId(null);
      props.setTotalDataUsage(null);
      props.newModelIsBeingCreated({
        isBeingCreated: false,
        newModelName: '',
      });
      setTimeout(() => {
        props.routeProps.history.push('/');
      }, 1000);
    }
  };

  const handleSignOut = () => {
    const user = props.user;
    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    /*
     * make API call to log out user, and destroy their session token
     */
    axios
      .post(

        'https://govoracle.azurewebsites.net/logout',
        // 'https://allvisionflask.azurewebsites.net/logout',
        user,
        headers
      )
      .then(
        (res) =>{

          console.log(res);
          setTimeout(function () {
            handleLogoutSuccess(res);
          }, 2000),
          setShowLogoutSnackbar(true);
        }


      )
      .catch((e) => console.log('e: ', e));
  };

  return (
    <>
      <LogoutSnackbar showLogoutSnackbar={showLogoutSnackbar}></LogoutSnackbar>
      <div className='settings-logout-wrapper'>
        <div className='settings-logout-content-wrapper'>
          <h1 className='settings-user-information-wrapper-title'>Sign Out</h1>
          <p>Sign out of your AllVision account.</p>
        </div>
        <Button
          className='settings-page-button logout'
          variant='outlined'
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}

/*
 * connect component to Redux
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsLogoutWrapper);
