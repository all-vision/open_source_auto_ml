import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  authenticateUser,
  authToken,
  addUserId,
} from '../../redux/actions/index';
import { useQuery, gql, useSubscription } from '@apollo/client';
import NotChromeModal from '../Shared/NotChromeModal';
import AccountAlreadyExistsModal from '../Shared/AccountAlreadyExistsModal';
import Skeleton from '@material-ui/lab/Skeleton';
import '../../styles/Login/login-wrapper.css';

function mapStateToProps(state) {
  return {
    userId: state.userId,
    stripeCustomerId: state.stripeCustomerId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: (user) => dispatch(authenticateUser(user)),
    authToken: (token) => dispatch(authToken(token)),
    addUserId: (userId) => dispatch(addUserId(userId)),
  };
}

/*
 * query all users
 * we need all users to find the target user (user that is logging in)
 */
const LOAD_ALL_USERS = gql`
  subscription {
    UsersTable {
      Company
      DatasetIDs
      DeployedModels
      JoinedDate
      Name
      UserID
      Email
    }
  }
`;

function LoginWrapperFunc(props) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailIsNull, setEmailIsNull] = useState(false);
  const [passwordIsNull, setPasswordIsNull] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorCopy, setLoginErrorCopy] = useState('');
  const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
  const [users, setUsers] = useState([]);
  const [showLoginSnackbar, setShowLoginSnackbar] = useState(false);
  /*
   * destructure results of LOAD_ALL_USERS query
   * data = array of users
   * loading = boolean, whether or not query is still loading
   * error = whether or not there was an error with the query
   */
  const { data, loading, error } = useSubscription(LOAD_ALL_USERS);

  useEffect(() => {
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload(true);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setUsers(data.UsersTable);
    }
  }, [data]);

  /*
   * toggle modal is account already exists
   */
  const handleAccountAlreadyExists = (value) => {
    if (value) {
      setAccountAlreadyExists(true);
      return;
    }
    setAccountAlreadyExists(false);
  };

  /*
   * update state with changes to email input field
   */
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  /*
   * update state with changes to password input field
   */
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleUserLoginSuccess = (res, userToLogin) => {
    /*
     * res = response from /login API call
     */
    if (res.data === 'error') {
      const loginErrorCopyText = 'There was an error logging you in!';
      setLoginError(true);
      setLoginErrorCopy(loginErrorCopyText);
    } else if (res.data.message === 'invalid username or password') {
      const loginErrorCopyText = 'invalid username or password';
      setLoginError(true);
      setLoginErrorCopy(loginErrorCopyText);
    } else {
      /*
       * handle login success
       * authenticate user
       * redirect user to datasets page
       */
      setLoginError(false);
      setShowLoginSnackbar(true);
      const targetUser = users.filter((u) => u.Email === userToLogin.email);
      const targetUserId = targetUser[0].UserID;
      props.addUserId(targetUserId);

      const targetUserInfo = {
        company: targetUser[0].Company,
        email: targetUser[0].Email,
        joinedData: targetUser[0].JoinedDate,
        name: targetUser[0].Name,
        datasets: targetUser[0].DatasetIDs,
      };

      const authData = {
        SessionToken: res.data.SessionToken,
      };
      props.authenticateUser(targetUserInfo);
      props.authToken(authData);
      setTimeout(function () {
        props.routeProps.history.push('/datasets');
      }, 2000);
    }
  };

  const handleLoginUser = (e) => {
    e.preventDefault();
    const loginErrorCopy = 'Please fill out missing fields.';
    /*
     * check that both email and password exist
     * render error alert snackbar if either don't exist
     */
    if (!email && !password) {
      setPasswordIsNull(true);
      setEmailIsNull(true);
      setLoginError(true);
      setLoginErrorCopy(loginErrorCopy);
    } else if (!email && password) {
      setPasswordIsNull(false);
      setEmailIsNull(true);
      setLoginError(true);
      setLoginErrorCopy(loginErrorCopy);
    } else if (email && !password) {
      setPasswordIsNull(true);
      setEmailIsNull(false);
      setLoginError(true);
      setLoginErrorCopy(loginErrorCopy);
    } else {
      /*
       * if email and password both exist, call /login endpoint with users' login information
       */
      const userToLogin = {
        email: email,
        password: password,
      };
      setPasswordIsNull(false);
      setEmailIsNull(false);
      setLoginError(false);

      let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      };

      axios
        .post(
          'https://govoracle.azurewebsites.net/login',
          // 'https://allvisionflask.azurewebsites.net/login', --Original
          userToLogin,
          headers
        )
        .then((res) => {
          console.log(res);
          handleUserLoginSuccess(res, userToLogin);
        })
        .catch((error) => console.log('error: ', error));
    }
  };

  return (
    <div className='login-wrapper'>
      {/* 
        if browser is not google chrome render window to let them know that
        they should use chrome for the best experience
      */}
      <NotChromeModal isChrome={!!window.chrome}></NotChromeModal>
      {/* render modal if account already exists with inputted email */}
      <AccountAlreadyExistsModal
        accountAlreadyExists={accountAlreadyExists}
        handleAccountAlreadyExists={handleAccountAlreadyExists}
      ></AccountAlreadyExistsModal>
      <div className='login-info'>
        {/* left side of page */}
        <div className='login-info-content'>
          <h1>allvision</h1>
          <h2>Access best in class unsupervised AI.</h2>
          <div className='login-info-content-icons'>
            <div className='login-info-content-icon-wrapper'>
              <CloudUploadIcon
                className='login-info-icon'
                fontSize={'large'}
              ></CloudUploadIcon>
              <p>Upload Your Data</p>
            </div>
            <div className='login-info-content-icon-wrapper'>
              <BubbleChartIcon
                className='login-info-icon'
                fontSize={'large'}
              ></BubbleChartIcon>
              <p>Visualize Clusters</p>
            </div>
            <div className='login-info-content-icon-wrapper'>
              <CompareArrowsIcon
                className='login-info-icon'
                fontSize={'large'}
              ></CompareArrowsIcon>
              <p>Compare Clustering Methods</p>
            </div>
            <div className='login-info-content-icon-wrapper'>
              <GpsNotFixedIcon
                className='login-info-icon'
                fontSize={'large'}
              ></GpsNotFixedIcon>
              <p>Optimize Model Performance</p>
            </div>
          </div>
        </div>
      </div>
      {/* right side of page */}
      {users.length === 0 ? (
        <Skeleton
          variant='rect'
          width={210}
          height={118}
          style={{
            margin: 'auto',
            display: 'flex',
            width: '30vw',
            height: '30vh',
          }}
        />
      ) : (
        <LoginForm
          className='login-form'
          emailIsNull={emailIsNull}
          passwordIsNull={passwordIsNull}
          loginErrorCopy={loginErrorCopy}
          loginError={loginError}
          routeProps={props.routeProps}
          handleLogin={props.handleLogin}
          showLoginSnackbar={showLoginSnackbar}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleLoginUser={handleLoginUser}
          handleAccountAlreadyExists={handleAccountAlreadyExists}
        ></LoginForm>
      )}
    </div>
  );
}

LoginWrapperFunc.propTypes = {
  authToken: PropTypes.func,
  handleLogin: PropTypes.func,
  routeProps: PropTypes.object,
  authenticateUser: PropTypes.func,
  addUserId: PropTypes.func,
  userId: PropTypes.number,
  stripeCustomerId: PropTypes.string,
};

/*
 * connect component to redux
 */
export default connect(mapStateToProps, mapDispatchToProps)(LoginWrapperFunc);
