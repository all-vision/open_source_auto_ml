import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import CopiedToClipboardSnackbar from '../CopiedToClipboardSnackbar';

export default function BillingAndUsage() {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // copy email to clipboard
  function copyTextFromElement(elementID) {
    let element = document.getElementById(elementID); //select the element
    let elementText = element.textContent; //get the text content from the element
    copyText(elementText); //use the copyText function below
    setCopiedToClipboard(true);
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }
  return (
    <div className="billing-and-usage-wrapper">
      <CopiedToClipboardSnackbar copiedToClipboard={copiedToClipboard} />
      <h1 className="settings-user-information-wrapper-title">
        Current Plan: <span>allvision lite</span>
      </h1>
      <div className="settings-current-plan-wrapper">
        <div className="settings-current-plan-features">
          <div className="settings-current-plan-feature-wrapper">
            <div className="current-plan-feature-wrapper">
              <CheckIcon style={{ color: '#43AA8B' }} />
              <p>Access to AllVisions unsupervised modeling software.</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <CheckIcon style={{ color: '#43AA8B' }} />
              <p>Detect emerging behaviors on .csv and .json data sets.</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <CheckIcon style={{ color: '#43AA8B' }} />
              <p>Deploy models as APIs.</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <CheckIcon style={{ color: '#43AA8B' }} />
              <p>Cluster and model explainability [COMING SOON].</p>
            </div>
          </div>
          <div className="settings-current-plan-feature-wrapper">
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Access to AllVisions unsupervised modeling software.</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Self-Deploy on your on private cloud..</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>
                Access individual APIs from our API Platform and bring them
                directly into your existing workflow.
              </p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Ongoing support from our team..</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Installation support and training for your team</p>
            </div>
          </div>
          <div className="settings-current-plan-feature-wrapper">
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>
                Integration with your custom data sources (batch and streaming).
              </p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Integrate with your enterprise&apos;s alerting tools.</p>
            </div>
            <div className="current-plan-feature-wrapper">
              <ClearIcon style={{ color: '#CED0CE' }} />
              <p>Multiple team members can collaborate on the same project.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="current-plan-upgrade-plan">
        To upgrade your allvision account please contact us at{' '}
        <Tooltip title="copy email to clipboard">
          <span
            id="email-address-to-copy"
            onClick={() => copyTextFromElement('email-address-to-copy')}
          >
            team@all.vision
          </span>
        </Tooltip>
        .
      </p>
    </div>

  // </div>
  );
}
