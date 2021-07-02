import React from 'react';
import LoginForm from './LoginForm';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import { connect } from 'react-redux';
import { authToken, authenticateUser } from '../../redux/actions/index';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../styles/Login/login-wrapper.css';

function mapDispatchToProps(dispatch) {
  return {
    authToken: (token) => dispatch(authToken(token)),
    authenticateUser: (user) => dispatch(authenticateUser(user)),
  };
}

class LoginWrapper extends React.Component {

  state = {
    email: null,
    password: null,
    emailIsNull: false,
    passwordIsNull: false,
    loginError: false,
    loginErrorCopy: ''
  }
  
  handleEmailChange = (e) => {
    const email = e.target.value;
    this.setState({
      email
    });
  }

  handlePasswordChange = (e) => {
    const password = e.target.value;
    this.setState({
      password
    });
  }

  handleUserLoginSuccess = (res) => {
    if (res.data === 'error') {
      const loginErrorCopy = 'There was an error logging you in!';
      this.setState({
        loginError: true,
        loginErrorCopy
      });
    } else if (res.data.message === 'invalid username or password') {
      const loginErrorCopy = 'There was an error logging you in!';
      this.setState({
        loginError: true,
        loginErrorCopy
      });
    }
    else {
      this.setState({
        loginError: false
      });
      const authData = {
        ExpiresAt: res.data.ExpiresAt,
        SessionToken: res.data.SessionToken,
        UpdateToken: res.data.UpdateToken
      };

      this.props.authenticateUser(authData);
      this.props.routeProps.history.push('/datasets');
    }
  }

  handleUserLoginError = (error) => {
    alert('error');
  }

  handleLoginUser = (e) => {
    e.preventDefault();
    const loginErrorCopy = 'Please fill out missing fields.';
    if (!this.state.email && !this.state.password) {
      this.setState({
        emailIsNull: true,
        passwordIsNull: true,
        loginError: true,
        loginErrorCopy
      });
    }
    else if (!this.state.email && this.state.password) {
      this.setState({
        emailIsNull: true,
        passwordIsNull: false,
        loginError: true,
        loginErrorCopy
      });
    }
    else if (this.state.email && !this.state.password) {
      this.setState({
        emailIsNull: false,
        passwordIsNull: true,
        loginError: true,
        loginErrorCopy
      });
    }
    else {
      const userToLogin = {
        email: this.state.email,
        password: this.state.password
      };
  
      this.setState({
        emailIsNull: false,
        passwordIsNull: false,
        loginError: false
      });
      
      axios
        .post('http://authapi.eastus.azurecontainer.io/login', userToLogin)
        .then((res) => this.handleUserLoginSuccess(res))
        .catch((error) => this.handleUserLoginError(error));

      this.props.authToken('test');
    }
    
  }
  render() {
    return (
      <div className="login-wrapper">
        <div className="login-info">
          <div className="login-info-content">
            <h1>allvision</h1>
            <p>
              Improve policies to combat fraud and solve other problems, by
              tracking behaviors and causal relationships as they emerge.
            </p>
            <div className="login-info-content-icons">
              <div className="login-info-content-icon-wrapper">
                <CloudUploadIcon
                  className="login-info-icon"
                  fontSize={'large'}
                ></CloudUploadIcon>
                <p>Upload Your Data</p>
              </div>
              <div className="login-info-content-icon-wrapper">
                <BubbleChartIcon
                  className="login-info-icon"
                  fontSize={'large'}
                ></BubbleChartIcon>
                <p>Visualize Clusters</p>
              </div>
              <div className="login-info-content-icon-wrapper">
                <CompareArrowsIcon
                  className="login-info-icon"
                  fontSize={'large'}
                ></CompareArrowsIcon>
                <p>Compare Clustering Methods</p>
              </div>
              <div className="login-info-content-icon-wrapper">
                <GpsNotFixedIcon
                  className="login-info-icon"
                  fontSize={'large'}
                ></GpsNotFixedIcon>
                <p>Optimize Model Performance</p>
              </div>
            </div>
          </div>
        </div>
        <LoginForm
          className="login-form"
          emailIsNull={this.state.emailIsNull}
          passwordIsNull={this.state.passwordIsNull}
          loginErrorCopy={this.state.loginErrorCopy}
          loginError={this.state.loginError}
          routeProps={this.props.routeProps}
          handleLogin={this.props.handleLogin}
          handleEmailChange={this.handleEmailChange}
          handlePasswordChange={this.handlePasswordChange}
          handleLoginUser={this.handleLoginUser}
        ></LoginForm>
      </div>
    );
  }
}


LoginWrapper.propTypes = {
  authToken: PropTypes.func,
  handleLogin: PropTypes.func,
  routeProps: PropTypes.object,
  authenticateUser: PropTypes.func
};


export default connect(null, mapDispatchToProps)(LoginWrapper);
