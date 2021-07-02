/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { connect } from 'react-redux';
import SettingsSkeleton from '../Settings/SettingsSkeleton';
import ApiDocumentation from '../Settings/ApiDocumentation/ApiDocumentation';
import '../../styles/Settings/settings.css';
import '../../styles/Settings/APIDocumentation/api-and-documentation.css';
import '../../styles/page.css';

// grab current user from redux
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userId: state.userId,
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
      <div className="entire-content">
        <Sidebar activePage="settings"></Sidebar>
        <section className="main-content">
          <SettingsSkeleton />
        </section>
      </div>
    );
  }
  return (
    <div className="entire-content">
      <Sidebar activePage="api"></Sidebar>
      {/* <SettingsTabs handleChangeTabs={handleChangeTabs} /> */}
      <section className="main-content">
        {/*
         * closure to toggle between pages depending on the activeTab property in state
         */}
        <ApiDocumentation userData={userData} userId={props.userId} />
        <a
          href="https://all-vision-tech.readme.io/docs"
          target="_blank"
          without
          rel="noreferrer"
          className='link-to-documentation'
        >
          Link To Documentation
        </a>
      </section>
    </div>
  );
}

export default connect(mapStateToProps)(Settings);
