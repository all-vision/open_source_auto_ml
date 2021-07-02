/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import CancelSubscriptionModal from './CancelSubscriptionModal';
import CancelSubscriptionSnackbar from './CancelSubscriptionSnackbar';
import axios from 'axios';
import { useQuery, gql, useSubscription } from '@apollo/client';
import Skeleton from '@material-ui/lab/Skeleton';

// ModelsTable(where: { ModelName: { _eq: $ModelName } }) {
//   ModelName
//   TableData
//   ModelScores
//   ModelID
//   ModelHyperparameters
//   Grouped
//   DatasetID
//   ClusteringColumn
// }

/*
* query active users' stripe customer ID
* query returns the stripeCustomerId, and an Array of their active subscriptions
*/
const GET_USERS_STRIPE_SUBSCRIPTION_ID = gql`
  query($UserID: Int) {
    UsersTable(where: { UserID: { _eq: $UserID } }) {
      StripeCustomerID
      ActiveSubscriptions
    }
  }
`;

/*
* grab current users' stripe customer id
*/
const mapStateToProps = (state) => {
  return {
    stripeCustomerId: state.stripeCustomerId,
    userId: state.userId,
  };
};

function CancelSubscription(props) {
  const [deleteAccountModalIsOpen, setDeleteAccountModalIsOpen] = useState(
    false
  );
  const [
    showCancelSubscriptionSnackbar,
    setShowCancelSubscriptionSnackbar,
  ] = useState(false);
  const [
    cancelSubscriptionSnackbarText,
    setCancelSubscriptionSnackbarText,
  ] = useState('');
  
  const [cancelSubscriptionApiResponseStatus, setCancelSubscriptionApiResponseStatus] = useState(403);

  // query active users' stripe customer id
  const usersStripeSubscriptionId = useQuery(GET_USERS_STRIPE_SUBSCRIPTION_ID, {
    variables: { UserID: props.userId },
  });

  let subscriptionId;

  const handleOpenDeleteAccountModal = () => {
    setDeleteAccountModalIsOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModalIsOpen(false);
  };

  const handleCancelSubscriptionSuccess = (res) => {

    if (res.status === 200) {
      setCancelSubscriptionApiResponseStatus(200);
      setCancelSubscriptionSnackbarText(
        'Your subscription was cancelled successfully, redirecting you now. '
      );
      setDeleteAccountModalIsOpen(false);
      setShowCancelSubscriptionSnackbar(true);
      setTimeout(() => {
        props.routeProps.history.push('/');
      }, 3000);

      // redirect user to homepage here
      return;
    } else if (res.status === 403) {
      setCancelSubscriptionApiResponseStatus(403);
      // handle 403 case
      setCancelSubscriptionSnackbarText(
        'Something went wrong while cancelling your subscription'
      );
      setDeleteAccountModalIsOpen(false);
      setShowCancelSubscriptionSnackbar(true);
    }
  };

  const handleCancelSubscriptionFailure = (e) => {
    setCancelSubscriptionApiResponseStatus(403);
    // handle 403 case
    setCancelSubscriptionSnackbarText(
      'Something went wrong while cancelling your subscription'
    );
    setDeleteAccountModalIsOpen(false);
    setShowCancelSubscriptionSnackbar(true);
  };

  const handleCancelSubscription = () => {

    // if (
    //   !usersStripeSubscriptionId.loading &&
    //   !usersStripeSubscriptionId.loading
    // ) {
    //   subscriptionId =
    //     usersStripeSubscriptionId.data.UsersTable[0].ActiveSubscriptions[0];
    // }

    // const testRes = {
    //   status: 403
    // };
    // handleCancelSubscriptionSuccess(testRes);
    if (subscriptionId) {
      axios({
        method: 'post',
        url: 'https://avtpayments.azurewebsites.net/cancel-subscription',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          subscriptionId: subscriptionId,
        },
      })
        .then((res) => handleCancelSubscriptionSuccess(res))
        .catch((e) => handleCancelSubscriptionFailure(e));
    }
  };

  if (usersStripeSubscriptionId.loading) {
    return (
      <Skeleton variant="rect" width={'100%'} height={100} style={{marginTop: '3vh', borderRadius: '5px'}} />
    );
  }
  if (!subscriptionId) {
    return (
      null
    );
  }
  return (
    <>
      <CancelSubscriptionModal
        deleteAccountModalIsOpen={deleteAccountModalIsOpen}
        handleCloseDeleteAccountModal={handleCloseDeleteAccountModal}
        handleCancelSubscription={handleCancelSubscription}
      />
      <div className="settings-logout-wrapper">
        <div className="settings-logout-content-wrapper">
          <h1 className="settings-user-information-wrapper-title">
            Cancel Subscription
          </h1>
          <p>This is a destructive action and will cancel your allvision subscription.</p>
        </div>
        <Button
          className="settings-page-button cancel-subscription"
          variant="contained"
          onClick={handleOpenDeleteAccountModal}
        >
          Cancel Subscription
        </Button>
      </div>

      <CancelSubscriptionSnackbar
        showCancelSubscriptionSnackbar={showCancelSubscriptionSnackbar}
        cancelSubscriptionSnackbarText={cancelSubscriptionSnackbarText}
        cancelSubscriptionApiResponseStatus={cancelSubscriptionApiResponseStatus}
      />
    </>
  );
}

export default connect(mapStateToProps)(CancelSubscription);
