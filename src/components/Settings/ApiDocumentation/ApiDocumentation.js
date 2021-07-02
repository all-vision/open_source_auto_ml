/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useQuery, gql, useSubscription, useMutation } from '@apollo/client';
import Tooltip from '@material-ui/core/Tooltip';
import CopiedAPIToClipboardSnackbar from './CopiedAPIToClipboardSnackbar';
import '../../../styles/Settings/APIDocumentation/api-and-documentation.css';
import '../../../styles/Settings/settings.css';
// queries active user by their UserID which lives in redux
// returns one user
const QUERY_ACTIVE_USER = gql`
  query($UserID: Int) {
    UsersTable(where: { UserID: { _eq: $UserID } }) {
      ApiKey
    }
  }
`;

export default function ApiDocumentation(props) {
  const [apiKey, setApiKey] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { userId } = props;

  const { data, loading, error } = useQuery(QUERY_ACTIVE_USER, {
    variables: { UserID: userId },
  });

  useEffect(() => {
    if (!error && !loading) {
      const usersApiKey = data.UsersTable[0].ApiKey;
      setApiKey(usersApiKey);
    }
  }, [data]);

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
    <div>
      <CopiedAPIToClipboardSnackbar copiedToClipboard={copiedToClipboard} />
      <h1 className="settings-content-header">API & Documentation</h1>
      <div className="api-key-wrapper">
        <h3 className="api-key-wrapper-header">API Key</h3>
        <div className="api-key-content-wrapper">
          {(() => {
            if (loading) {
              return (
                <h3 className="api-key-wrapper-content">loading api key</h3>
              );
            }
            if (apiKey) {
              return (
                <>
                  <Tooltip title="Copy API Key to Clipboard">
                    <h3
                      className="api-key-wrapper-content"
                      style={{fontWeight: 400}}
                      id="api-key-to-copy"
                      onClick={() => copyTextFromElement('api-key-to-copy')}
                    >
                      {apiKey}
                    </h3>
                  </Tooltip>
                </>
              );
            } else {
              return <h3>no api key found</h3>;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
