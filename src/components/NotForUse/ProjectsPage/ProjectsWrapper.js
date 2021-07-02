/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';
import '../../styles/Projects/projects-main.css';
import TopNav from '../TopNavigation/ExternalTopNav/ExternalTopNav';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CreateProjectModal from './CreateProjectModal';

export default class ProjectMain extends Component {
  state = {
    modalIsOpen: false,
    modalError: false,
    projects: [
      {
        id: '1',
        projectName: 'Project One',
        createdBy: 'Sherif Elmetwally',
        lastUpdated: '1/31/2021, 7:19:27 PM',
        actionsIcon: <MoreVertIcon></MoreVertIcon>,
      },
      {
        id: '2',
        projectName: 'Project Two',
        createdBy: 'Katie Kuzin',
        lastUpdated: '7/31/2020, 4:19:27 AM',
        actionsIcon: <MoreVertIcon></MoreVertIcon>,
      },
      {
        id: '3',
        projectName: 'Project Three',
        createdBy: 'Sherif Elmetwally',
        lastUpdated: '1/11/2020, 1:19:27 PM',
        actionsIcon: <MoreVertIcon></MoreVertIcon>,
      },
    ],
  };

  handleProjectCreation = (newProjectName) => {
    if (newProjectName.trim().length > 0) {
      const newProject = {
        projectName: newProjectName,
        createdBy: this.props.user,
        lastUpdated: new Date().toLocaleString(),
        actionsIcon: <MoreVertIcon></MoreVertIcon>,
      };
      this.setState((prevState) => ({
        projects: [...prevState.projects, newProject],
        modalError: false,
        modalIsOpen: false,
      }));
    } else {
      this.setState({
        modalError: true,
      });
    }
  };

  handleModalOpen = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  render() {
    return (
      <>
        <TopNav></TopNav>
        <CreateProjectModal
          modalError={this.state.modalError}
          modalIsOpen={this.state.modalIsOpen}
          handleModalClose={this.handleModalClose}
          handleProjectCreation={this.handleProjectCreation}
        ></CreateProjectModal>
        <div className="projects-container">
          <Projects
            projects={this.state.projects}
            handleModalOpen={this.handleModalOpen}
          ></Projects>
          <ProjectDetails></ProjectDetails>
        </div>
      </>
    );
  }
}
