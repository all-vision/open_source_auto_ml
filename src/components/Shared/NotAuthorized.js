import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import '../../styles/not-authorized-page.css';

/*
*  component to handle when a users' session token has expired
*/
export default function NotAuthorized(props) {
  const redirectUserToLoginPage = () => {
    props.routeProps.history.push('/');
  };

  return (
    <div className="not-authorized-wrapper">
      <div className="not-authorized-content">
        <h1>Your Session Expired.</h1>
        <Button
          color="primary"
          variant={'contained'}
          className="not-authorized-button"
          onClick={redirectUserToLoginPage}
        >
          Click to be redirected to the Login Screen
        </Button>
      </div>
    </div>
  );
}

NotAuthorized.propTypes = {
  routeProps: PropTypes.object,
};
