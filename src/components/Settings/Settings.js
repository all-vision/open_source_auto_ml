/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { connect } from 'react-redux';
import SettingsUserInfo from './SettingsUserInfo';
import SettingsLogoutWrapper from './SettingsLogoutWrapper';
import CancelSubscription from './CancelSubscription';
import SettingsSkeleton from './SettingsSkeleton';
import DeleteAccount from './DeleteAccount';
import SettingsTabs from './SettingsTabs';
import CancelSubscriptionSnackbar from './CancelSubscriptionSnackbar';
import SettingsWrapper from './SettingsWrapper';
import BillingAndUsage from './BillingAndUsage/BillingAndUsage';
import ApiDocumentation from './ApiDocumentation/ApiDocumentation';
import '../../styles/Settings/settings.css';
import '../../styles/page.css';

// grab current user from redux
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userId: state.userId
  };
};

function Settings(props) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  /*
  * grab active users' information from redux
  */
  useEffect(() => {
    setUserData(props.user);
  }, [props.user]);

  /*
  * update the active tab based on users input
  */
  const handleChangeTabs = (newTab) => {
    setActiveTab(newTab);
  };


  /*
  * if there is no userData or page is still loading, render a skeleton component
  */
  if (!userData || Object.keys(userData).length === 0 || isLoading) {
    return (
      <div className='entire-content'>
        <Sidebar activePage='settings' />
        <div className='main-content'>
          <SettingsSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className='entire-content'>
      <Sidebar activePage='settings' />
      <SettingsTabs handleChangeTabs={handleChangeTabs} />
      <div className='main-content'>
        
        {/*
        * closure to toggle between pages depending on the activeTab property in state
        */}
        {
          (() => {
            if (activeTab === 0) {
              return <SettingsWrapper userData={userData} routeProps={props.routeProps} />;
            }
            if (activeTab === 1) {
              return <BillingAndUsage />;
            }
          })()
        }
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Settings);