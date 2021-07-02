import React from 'react';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import { connect } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import whiteLogo from '../../assets/white_logo.svg';
import PropTypes from 'prop-types';
import '../../styles/sidebar.css';
import '../../styles/page.css';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    selectedDataset: state.selectedDataset,
    activeDatasetData: state.activeDatasetData,
    activeModel: state.activeModel,
    allModelNames: state.allModelNames,
    originalDatasetSize: state.originalDatasetSize,
  };
};

class RSidebar extends React.Component {
  state = {
    showAllModels: false,
    showAllClusters: false,
    existingModelNames: []
  };

  showClusters = () => {
    this.setState({
      showAllClusters: !this.state.showAllClusters
    });
  }

  showModels = () => {
    this.setState({
      showAllModels: !this.state.showAllModels,
    });
  };

  componentDidMount() {    
    if (
      this.props.activePage === 'modeldetails' ||
      this.props.activePage === 'unsupervised'
    ) {
      this.setState({
        showAllModels: true,
      });
    }

    if (this.props.activePage === 'cluster') {
      this.setState({
        showAllClusters: true
      });
    }
  }


  render() {
    return (
      <>
        <div className="sidebar-container">
          {this.props.selectedDataset && this.props.activeDatasetData !== null ?  (
            <>
              <div className="sidebar-header">
                <Link
                  style={{
                    width: '100%',
                    textDecoration: 'none',
                    color: 'white',
                  }}
                  to="/datasets"
                >
                  <h1>
                    <img
                      src={whiteLogo}
                      alt="logo"
                      className="white-logo"
                    ></img>
                  </h1>
                </Link>
              </div>
              <div className="sidebar-link-wrapper">
                <div className="active-dataset-wrapper">
                  <p className="active-dataset-title">Active Dataset</p>
                  <p className="active-dataset">
                    <CheckIcon
                      fontSize={'small'}
                      style={{
                        marginTop: '1vh',
                        marginRight: '.25vw',
                        color: '#1565C0',
                      }}
                    />
                    {this.props.selectedDataset.DatasetName.slice(0,15)}...<br></br>
                    {/* <span className="active-dataset-span">
                    ({(this.props.activeDatasetData.length / 1000).toFixed(1)}k rows, {Object.keys(this.props.activeDatasetData[0]).length} columns)
                    </span> */}
                    {
                      this.props.originalDatasetSize.column > 0 && this.props.originalDatasetSize.rows > 0
                        ?
                        <span className="active-dataset-span">
                      ({(this.props.originalDatasetSize.rows / 1000).toFixed(1)}k rows, {this.props.originalDatasetSize.column} columns)
                        </span>
                        :
                        null
                    }

                    {/* <span>
                      {
                        this.props.originalDatasetSize.columns > 0 && this.props.originalDatasetSize.rows > 0
                          ?
                          <p>({(this.props.originalDatasetSize.rows.length / 1000).toFixed(1)}k rows, {this.props.originalDatasetSize.columns} columns)</p>
                          :
                          null
                      }
                    </span> */}
                  </p>
                </div>
                <div
                  className={
                    this.props.activePage === 'datasets'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Link
                    to="/datasets"
                    className='sidebar-links'
                    
                  >
                    <Button className="sidebar-button">My Datasets</Button>
                  </Link>
                </div>
                <div
                  className={
                    this.props.activePage === 'unsupervised'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Button className="sidebar-button">
                    <Link
                      to="/unsupervised"
                      className='sidebar-links'
                    >
                      Model Zoo
                    </Link>
                    {this.props.mods ? (
                      <ExpandMoreIcon
                        style={{
                          transform: this.state.showAllModels
                            ? 'rotate(180deg)'
                            : '',
                        }}
                        className="sidebar-expand"
                        onClick={this.showModels}
                      />
                    ) : (
                      <ExpandMoreIcon
                        style={{ visibility: 'hidden' }}
                        className="sidebar-expand"
                        onClick={this.showModels}
                      />
                    )}
                  </Button>
                </div>
                <div
                  className="hidden-content"
                  style={{
                    display: this.state.showAllModels ? 'flex' : 'none',
                  }}
                >
                  {this.props.mods
                    ? this.props.mods.map((m, index) => {
                      return (
                        <Button
                          className="hidden sidebar-button"
                          onClick={() => this.props.handleSelectActiveModel(m)}
                          style={{
                            background: this.props.activeModel
                              ? this.props.activeModel.ModelName === m.ModelName
                                ? '#1565C0'
                                : ''
                              : null,
                          }}
                          key={index}
                        >
                          {m.ModelName.length > 20 ? `${m.ModelName.slice(0,15)}...` : m.ModelName }
                          {/* {m.ModelName.slice(0,15)} */}
                        </Button>
                      );
                    })
                    : null}
                </div>
                <div
                  className={
                    this.props.activePage === 'cluster-exploration'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Button className="sidebar-button">
                    <Link
                      to="/cluster-exploration"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      Cluster Exploration
                    </Link>
                    {this.props.clusters ? (
                      <ExpandMoreIcon
                        style={{
                          transform: this.state.showAllClusters
                            ? 'rotate(180deg)'
                            : '',
                        }}
                        className="sidebar-expand"
                        onClick={this.showClusters}
                      />
                    ) : (
                      <ExpandMoreIcon
                        style={{ visibility: 'hidden' }}
                        className="sidebar-expand"
                        onClick={this.showClusters}
                      />
                    )}
                  </Button>
                </div>

                <div
                  className="hidden-content"
                  style={{
                    display: this.state.showAllClusters ? 'flex' : 'none',
                  }}
                >
                  {this.props.clusters
                    ? this.props.clusters.map((m, index) => {

                      return (
                        <Button
                          className="hidden sidebar-button"
                          onClick={() => this.props.handleSelectActiveCluster(m)}
                          style={{
                            // eslint-disable-next-line react/prop-types
                            background: this.props.activeCluster
                              // eslint-disable-next-line react/prop-types
                              ? this.props.activeCluster === m
                                ? '#1565C0'
                                : ''
                              : null,
                          }}
                          key={index}
                        >
                          {m.length > 20 ? `${m.slice(0, 15)}...` : m}
                        </Button>
                      );
                    })
                    : null}
                </div>
                <div
                  className={
                    this.props.activePage === 'settings'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Link
                    to="/settings"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Button className="sidebar-button">Account & Settings</Button>
                  </Link>
                </div>
                <div
                  className={
                    this.props.activePage === 'api'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Link
                    to="/api"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Button className="sidebar-button">API & Documentation</Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="sidebar-header">
                <Link
                  style={{
                    width: '100%',
                    textDecoration: 'none',
                    color: 'white'
                  }}
                  to="/datasets"
                >
                  <h1>
                    <img
                      src={whiteLogo}
                      alt="logo"
                      className="white-logo"
                    />
                  </h1>
                </Link>
              </div>

              <div className="sidebar-link-wrapper">
                <div
                  className={
                    this.props.activePage === 'datasets'
                      ? 'active-sidebar-link-wrapper'
                      : 'none'
                  }
                >
                  <Link
                    to="/datasets"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Button className="sidebar-button">My Datasets</Button>
                  </Link>
                </div>
              </div>
              <div
                className={
                  this.props.activePage === 'unsupervised'
                    ? 'active-sidebar-link-wrapper'
                    : 'none'
                }
              >
                <Button className="inactive-sidebar-button">
                  <Link
                    to="/datasets"
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Model Zoo
                  </Link>
                  {this.props.mods ? (
                    <ExpandMoreIcon
                      style={{
                        transform: this.state.showAllModels
                          ? 'rotate(180deg)'
                          : '',
                      }}
                      className="sidebar-expand"
                      onClick={this.showModels}
                    />
                  ) : (
                    <ExpandMoreIcon
                      style={{ visibility: 'hidden' }}
                      className="sidebar-expand"
                      onClick={this.showModels}
                    />
                  )}
                </Button>
              </div>
              <div
                className={
                  this.props.activePage === 'cluster-exploration'
                    ? 'active-sidebar-link-wrapper'
                    : 'none'
                }
              >
                <Link
                  to="/datasets"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Button className="inactive-sidebar-button">Cluster Exploration</Button>
                </Link>
              </div>
              <div
                className={
                  this.props.activePage === 'settings'
                    ? 'active-sidebar-link-wrapper'
                    : 'none'
                }
              >
                <Link
                  to="/settings"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Button className="sidebar-button">Account & Settings</Button>
                </Link>
              </div>
              <div
                className={
                  this.props.activePage === 'api'
                    ? 'active-sidebar-link-wrapper'
                    : 'none'
                }
              >
                <Link
                  to="/api"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Button className="sidebar-button">API & Documentation</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(RSidebar);

RSidebar.propTypes = {
  activePage: PropTypes.string,
  selectedDataset: PropTypes.object,
  models: PropTypes.array,
  allModelNames: PropTypes.array,
  mods: PropTypes.array,
  model: PropTypes.object,
  routeProps: PropTypes.object,
  user: PropTypes.object,
  activeDatasetData: PropTypes.array,
  activeModel: PropTypes.object,
  handleSelectActiveModel: PropTypes.func,
  staticModels: PropTypes.array,
  originalDatasetSize: PropTypes.object,
  handleSelectActiveCluster: PropTypes.func,
  clusters: PropTypes.array,
};
