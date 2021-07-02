/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import '../../styles/Projects/projects.css';
import AddIcon from '@material-ui/icons/Add';
import ProjectsTable from './ProjectsTable';

export default class Projects extends Component {
  render() {
    return (
      <div className="projects-wrapper">
        <div className="projects-wrapper-header">
          <h1>Projects</h1>
          <Button
            variant="contained"
            color="primary"
            className="projects-header-button"
            onClick={this.props.handleModalOpen}
          >
            <AddIcon></AddIcon>Create new Project
          </Button>
        </div>
        <div className="projects-table">
          <ProjectsTable projects={this.props.projects}></ProjectsTable>
        </div>
      </div>
    );
  }
}
