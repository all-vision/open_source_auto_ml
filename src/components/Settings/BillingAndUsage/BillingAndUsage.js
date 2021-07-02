import React from 'react';
import Plan from './Plan';
import Usage from './Usage';

import '../../../styles/Settings/BillingAndUsage/billing-and-usage.css';

export default function BillingAndUsage() {
  return (
    <div className="billing-and-usage-wrapper">
      <h1 className="settings-content-header">Billing & Usage</h1>
      <div className="settings-user-information-wrapper">
        <Plan />
      </div>
      <div className="settings-user-information-wrapper">
        <Usage />
      </div>
    </div>
  );
}
