/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import SettingsUserInfo from './SettingsUserInfo';
import SettingsLogoutWrapper from './SettingsLogoutWrapper';
import CancelSubscription from './CancelSubscription';
import SettingsSkeleton from './SettingsSkeleton';
import { connect } from 'react-redux';
import DeleteAccount from './DeleteAccount';
import '../../styles/Settings/settings.css';

// grab current user from redux
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

function SettingsWrapper(props) {

  return (
    <>
      <h1 className="settings-content-header">Settings</h1>
      <SettingsUserInfo userData={props.userData} />
      <SettingsLogoutWrapper routeProps={props.routeProps} />
      <CancelSubscription routeProps={props.routeProps} />
      <DeleteAccount />
    </>
  );
}

export default connect(mapStateToProps)(SettingsWrapper);
