import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
// import './styles/not-authorized-page.css';
import '../../styles/not-authorized-page.css';

/*
* component to handle case when user has no active subscription plan
*/
export default function NotAuthorized(props) {
  /*
  * redirect user to payment plan selection page
  */
  const redirectUserToLoginPage = () => {
    props.routeProps.history.push('/plan');
  };

  return (
    <div className="not-authorized-wrapper">
      <div className="not-authorized-content">
        <h1>No subscription found.</h1>
        <Button
          color="primary"
          variant={'contained'}
          className="not-authorized-button"
          onClick={redirectUserToLoginPage}
        >
          Click to be redirected to the payment plan page.
        </Button>
      </div>
    </div>
  );
}

NotAuthorized.propTypes = {
  routeProps: PropTypes.object,
};
