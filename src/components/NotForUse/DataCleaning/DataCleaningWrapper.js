/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import Papa from 'papaparse';
import titanic_data from '../../data/titanic_data.csv';
import DataCleaningFileDetails from './DataCleaningFileDetails';
import ActionLogWrapper from './ActionLog/ActionLogWrapper';
import Sidebar from '../Sidebar/Sidebar';
import TopNav from '../TopNavigation/TopNav';
import Loading from '../Shared/Loading';

import '../../styles/DataCleaning/data-cleaning-wrapper.css';

export default class DataCleaningWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      limit: 50,
      labelIndex: -1,
      fileName: 'titanic_data.csv',
      rowsCount: '124',
      columnsCount: '6',
      actions: [],
      activePage: 'cleaning',
      addNewStepModalIsOpen: false,
    };

    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    this.getCsvData();
  }

    handleModalOpen = () => {
      this.setState({
        addNewStepModalIsOpen: true
      });
    }

    handleModalClose = () => {
      this.setState({
        addNewStepModalIsOpen: false
      });
    }

    handleLabelUpdate = (e) => {
      const newLabel = e.target.value;
      if (newLabel !== -1) {
        const index = this.state.data[0].indexOf(newLabel);
        this.setState({
          labelIndex: index
        });
      } else {
        this.setState({
          labelIndex: -1
        });
      }
        
    }

    fetchCsv() {
      return fetch(titanic_data).then(function (response) {
        let reader = response.body.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader.read().then(function (result) {
          return decoder.decode(result.value);
        });
      });
    }

    getData(result) {
      this.setState({data: result.data});
    }

    async getCsvData() {
      let csvData = await this.fetchCsv();

      Papa.parse(csvData, {
        complete: this.getData
      });
    }

    render() {
      if (!this.state.data.length > 0) {
        return <Loading></Loading>;
      }
      return (
        <>
          <div className="sidebar-page-wrapper" style={{display: 'flex', flexDirection:'row'}}>
            <Sidebar activePage={this.state.activePage} fileInformation={this.state.fileName}></Sidebar>
            <div className="data-cleaning-wrapper">
              <div className="data-cleaning-left-side">
                <div className="data-cleaning-header">
                  <h1>Data Cleaning</h1>
                  <DataCleaningFileDetails 
                    fileName={this.state.fileName}
                    columnsCount={this.state.columnsCount}
                    rowsCount={this.state.rowsCount}
                    data={this.state.data}
                  ></DataCleaningFileDetails>
                </div>
              </div>
              <div className="data-cleaning-right-side">
                <ActionLogWrapper 
                  addNewStepModalIsOpen={this.state.addNewStepModalIsOpen}
                  handleModalOpen={this.handleModalOpen}
                  handleModalClose={this.handleModalClose}
                  columns={this.state.data[0]}
                  labelIndex={this.state.labelIndex}
                  handleLabelUpdate={this.handleLabelUpdate}
                ></ActionLogWrapper>
              </div>
            </div>
          </div>

        </>
      );
    }
}