/* eslint-disable react/prop-types */
import React from 'react';

/*
* Component that renders information about the active user, name, email, joined date, etc
*/
export default function SettingsUserInfo(props) {
  return (
    <div className="settings-user-information-wrapper">
      <h1 className="settings-user-information-wrapper-title">
        User Information
      </h1>
      <div className="user-information-card-wrapper">
        <div className="user-information-card">
          <h3 className="user-information-card-header">Name</h3>
          <p className="user-information-card-content">{props.userData.name}</p>
        </div>
        <div className="user-information-card">
          <h3 className="user-information-card-header">Email</h3>
          <p className="user-information-card-content">
            {props.userData.email}
          </p>
        </div>
        <div className="user-information-card">
          <h3 className="user-information-card-header">Company</h3>
          <p className="user-information-card-content">
            {props.userData.company ? props.userData.company : 'N/A'}
          </p>
        </div>
        {/* <div className="user-information-card">
          <h3 className="user-information-card-header">Joined Date</h3>
          <p className="user-information-card-content">
            {props.userData.joinedData.slice(0, 10)}
          </p>
        </div> */}
      </div>
    </div>
  );
}
