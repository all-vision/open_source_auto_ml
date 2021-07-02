import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginWrapper from './components/Login/LoginWrapper';
import LoginWrapperFunc from './components/Login/LoginWrapperFunc';
import LoadingScreen from './components/Shared/Loading';
import { connect } from 'react-redux';
import { authenticateUser, setActiveDatasetData } from './redux/actions/index';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import NotAuthorized from './components/Shared/NotAuthorized';
import UserHasntPaid from './components/Shared/UserHasntPaid.js';
import PageNotFound from './components/Shared/404Page';
import ErrorBoundary from './ErrorBoundary';
import APIDocumentation from './components/APIDocumentation/ApiDocumentation';
import withClearCache from './ClearCache';
import { getBuildDate } from './utils/utils.js';
import './styles/app.css';

// Lazy load pages to improve load speed
const ModelZooWrapper = React.lazy(() => 
  import('./components/ModelZoo/ModelZooWrapper')
);

const YourDatasetsWrapperFunc = React.lazy(() => 
  import('./components/YourDatasets/YourDatasetsWrapper')
);

const ModelDetailsWrapper = React.lazy(() => 
  import('./components/ModelDetails/ModelDetailsWrapper')
);

const Settings = React.lazy(() => import('./components/Settings/Settings'));

const ClusterExploration = React.lazy(() => import('./components/ClusterExploration/ClusterExploration'));

const ClusterDetails = React.lazy(() => import('./components/ClusterExploration/ClusterDetails/ClusterDetails'));

console.log('//////////////////////////////');
console.log('Welcome to app.all.vision 👀');
console.log('//////////////////////////////');


function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: (user) => dispatch(authenticateUser(user)),
    setActiveDatasetData: (data) => dispatch(setActiveDatasetData(data))
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};


class App extends Component {
  state = {
    activePage: 'cleaning',
    isChrome: null,
    selectedDataset: null,
    showLoadingScreen: false,
    activeData: [],
    isBillingAnnualy: false
  };

  handleLogin = (res) => {
    this.props.authenticateUser(res.profileObj);
    this.setState({
      user: this.props.user,
    });
  };

  handleSetIsBillingAnnually = () => {
    this.setState({
      isBillingAnnualy: !this.state.isBillingAnnualy
    });
  }

  handleSelectDataset = (file) => {
    const fileDatasetIDRef = file.DatasetIDRef;

    this.setState({
      selectedDataset: file,
    });
  };

  render() {
    if (this.state.showLoadingScreen) {
      return (
        <LoadingScreen></LoadingScreen>
      );
    }
    else {
      return (
        <>
          <ErrorBoundary>
            <BrowserRouter>
              <Switch>
                <Route
                  path="/"
                  exact
                  render={(routeProps) => (
                    <LoginWrapperFunc
                      routeProps={routeProps}
                      handleLogin={this.handleLogin}
                    ></LoginWrapperFunc>
                  )}
                />
                <Route
                  path="/login"
                  exact
                  render={(routeProps) => (
                    <LoginWrapper
                      routeProps={routeProps}
                      handleLogin={this.handleLogin}
                    ></LoginWrapper>
                  )}
                />
                <Route
                  path="/notauthorized"
                  exact
                  render={(routeProps) => (
                    <NotAuthorized routeProps={routeProps}></NotAuthorized>
                  )}
                />
                <Route
                  path="/noplan"
                  exact
                  render={(routeProps) => (
                    <UserHasntPaid routeProps={routeProps}></UserHasntPaid>
                  )}
                />
                <Route
                  path='/settings'
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <Settings routeProps={routeProps} />
                    </Suspense>
                  )}
                />
                <Route
                  path="/datasets"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <YourDatasetsWrapperFunc
                        routeProps={routeProps}
                        handleSelectDataset={this.handleSelectDataset}
                        selectedDataset={this.state.selectedDataset}
                      />
                    </Suspense>
                  )
                  }
                />
                <Route
                  path="/unsupervised"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ModelZooWrapper
                        routeProps={routeProps}
                        user={this.state.user}
                        activePage={this.state.activePage}
                        activeData={this.state.activeData}
                        selectedDataset={this.state.selectedDataset}
                      />
                    </Suspense>
                  )
                  }
                />
                <Route
                  path="/api"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <APIDocumentation
                        routeProps={routeProps}
                        user={this.state.user}
                      />
                    </Suspense>
                  )
                  }
                />
                <Route
                  path="/modeldetails/:id"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ModelDetailsWrapper
                        routeProps={routeProps}
                        user={this.state.user}
                        selectedDataset={this.state.selectedDataset}
                      />
                    </Suspense>
                  )
                  }
                />
                {/* ClusterExploration */ }
                <Route
                  path="/cluster-exploration"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ClusterExploration
                        routeProps={routeProps}
                        user={this.state.user}
                      />
                    </Suspense>
                  )
                  }
                />
                <Route
                  path="/cluster/:id"
                  exact
                  render={(routeProps) => (
                    <Suspense fallback={<LoadingScreen />}>
                      <ClusterDetails
                        routeProps={routeProps}
                        // DATA={DATA}
                        user={this.state.user}
                        selectedDataset={this.state.selectedDataset}
                      />
                    </Suspense>
                  )
                  }
                />
                {/* add route to handle when a user goes to a url that does not exist on our site */ }
                <Route component={PageNotFound} />
              </Switch>
            </BrowserRouter>
          </ErrorBoundary>
        </>
      );
    }

  }
}
const ClearCacheComponent = withClearCache(App);

class RealApp extends Component {
  render() {
    return (
      <ClearCacheComponent />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealApp);

App.propTypes = {
  authenticateUser: PropTypes.func,
  setActiveDatasetData: PropTypes.func,
  user: PropTypes.object,
  client:PropTypes.object,
  routeProps: PropTypes.object,
  history: PropTypes.object
};
