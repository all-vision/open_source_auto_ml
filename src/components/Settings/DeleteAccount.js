import React, { useState } from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import CopiedToClipboardSnackbar from './CopiedToClipboardSnackbar';

export default function DeleteAccount() {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);


  /*
  * function to copy email to clipboard
  */
  function copyTextFromElement(elementID) {
    let element = document.getElementById(elementID); //select the element
    let elementText = element.textContent; //get the text content from the element
    copyText(elementText); //use the copyText function below

    /*
    * toggle copied to clipboard snackbar to true
    */
    setCopiedToClipboard(true);
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <CopiedToClipboardSnackbar copiedToClipboard={copiedToClipboard} />
      <div className="settings-logout-wrapper delete">
        <div className="settings-logout-content-wrapper">
          <h1 className="settings-user-information-wrapper-title">
          Delete Account
          </h1>
          <p>
          To delete your allvision account please contact us at{' '}
            <Tooltip title='copy email to clipboard'>
              <span id="email-address-to-copy" onClick={() => copyTextFromElement('email-address-to-copy')}>
              team@all.vision
              </span>
            </Tooltip>
          .
          </p>
        </div>
      </div>
    </>
  );
}
