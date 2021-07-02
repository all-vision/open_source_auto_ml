import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from '../../assets/logo.svg';
import LoginError from './LoginError';
import PropTypes from 'prop-types';
import { Link as RouteLink } from 'react-router-dom';
import LoginSnackbar from './LoginSnackbar.tsx';
import '../../styles/Login/login-wrapper.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();

  return (
    <>
      <Container component="main" maxWidth="sm" className="login-form">
        <LoginSnackbar showLoginSnackbar={props.showLoginSnackbar} />
        {props.loginError ? (
          <LoginError loginErrorCopy={props.loginErrorCopy}></LoginError>
        ) : null}
        <CssBaseline />
        <div
          className="sign-in-form"
          style={{ marginTop: props.loginError ? '2vh' : null }}
        >
          <img src={logo} alt="logo"></img>
          <form className={classes.form} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => props.handleEmailChange(e)}
              autoFocus
              error={props.emailIsNull}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => props.handlePasswordChange(e)}
              error={props.passwordIsNull}
            />

            <RouteLink className='login-button' to="/datasets" >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="signin-button"
                onClick={props.handleLoginUser}
              >
                Log In
              </Button>
            </RouteLink>
          </form>
        </div>
      </Container>
    </>
  );
}

SignIn.propTypes = {
  emailIsNull: PropTypes.bool,
  handleEmailChange: PropTypes.func,
  handleLogin: PropTypes.func,
  handleLoginUser: PropTypes.func,
  handlePasswordChange: PropTypes.func,
  loginError: PropTypes.bool,
  loginErrorCopy: PropTypes.string,
  passwordIsNull: PropTypes.bool,
  routeProps: PropTypes.object,
  handleAccountAlreadyExists: PropTypes.func,
  showLoginSnackbar: PropTypes.bool
};
