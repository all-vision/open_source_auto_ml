/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import SummaryPageButtons from './SummaryPageButtons';
import SummaryPageCard from './SummaryPageCard';
import '../../styles/SummaryPage/summary-page-wrapper.css';
import Sidebar from '../Sidebar/Sidebar';
import Loading from '../Shared/Loading';
import SummaryPageTabs from './SummaryPageTabs';
import ClusterChartWrapper from './ClusterChartWrapper/ClusterChartWrapper';
import DataTableWrapper from './DataTableWrapper/DataTableWrapper';

export default class SummaryWrapper extends Component {
  state = {
    activePage: 'summary',
    activeTab: 0,
    showLoadingScreen: true,
    testData: [
      'data',
      30,
      200,
      100,
      400,
      150,
      250,
      200,
      100,
      400,
      150,
      250,
      30,
      200,
      100,
      400,
      150,
      250,
      200,
      100,
      400,
      150,
      250,
    ],
    columns: [
      {
        columnName: 'survived',
        type: 'character',
        data: [
          30,
          200,
          100,
          400,
          150,
          250,
          200,
          100,
          400,
          150,
          250,
          30,
          200,
          100,
          400,
          150,
          250,
          200,
          100,
          400,
          150,
          250,
        ],
        label: true,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
      {
        columnName: 'pclass',
        type: 'character',
        data: [124, 400, 150, 250, 200, 100, 400, 150, 250],
        label: false,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
      {
        columnName: 'sex',
        type: 'character',
        data: [3, 12, 42, 14, 12],
        label: false,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
      {
        columnName: 'age',
        type: 'numeric',
        data: [
          30,
          200,
          100,
          90,
          150,
          250,
          200,
          100,
          30,
          150,
          250,
          30,
          200,
          100,
          400,
          150,
          250,
          200,
          100,
          400,
          150,
          250,
          100,
          150,
          150,
          250,
          30,
          200,
          30,
          200,
          100,
          150,
          30,
          200,
          100,
          20,
          150,
        ],
        label: false,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
      {
        columnName: 'sibsp',
        type: 'numeric',
        data: [30, 150, 250],
        label: false,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
      {
        columnName: 'parch',
        type: 'character',
        data: [150, 150, 200, 100, 60, 150, 250],
        label: false,
        valid: 112,
        missing: 12,
        min: 3,
        mean: 65,
        std: 4,
      },
    ],
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showLoadingScreen: false,
      });
    }, 1500);
  }

  handleUpdateActiveTab = (value) => {
    this.setState({
      activeTab: value,
    });
  };

  render() {
    if (this.state.showLoadingScreen) {
      return <Loading></Loading>;
    }
    return (
      <>
        <div
          className="sidebar-page-wrapper"
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <Sidebar
            activePage={this.state.activePage}
            fileInformation={this.props.fileInformation[0].fileName}
          ></Sidebar>
          <div
            className="summary-page-main-content"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <SummaryPageTabs
              handleUpdateActiveTab={this.handleUpdateActiveTab}
            ></SummaryPageTabs>
            <div className="summary-page-wrapper">
              <div className="summary-page-title-wrapper">
                {this.state.activeTab === 0 ? (
                  <h1>Data Summary</h1>
                ) : this.state.activeTab === 1 ? (
                  <h1>DB Scan Summary</h1>
                ) : (
                  <h1>Data Table</h1>
                )}
                {/* <h1>Data Summary</h1> */}
                {this.state.activeTab === 1 ? (
                  <h3>
                    Here is a cluster chart showing how your cleaned data forms
                    clusters.
                  </h3>
                ) : (
                  ''
                )}
                <SummaryPageButtons></SummaryPageButtons>
              </div>
              {this.state.activeTab === 0 ? (
                <div className="summary-page-cards-wrapper">
                  {this.state.columns.map((col, index) => {
                    return (
                      <SummaryPageCard
                        key={index}
                        column={col}
                      ></SummaryPageCard>
                    );
                  })}
                </div>
              ) : this.state.activeTab === 1 ? (
                <ClusterChartWrapper
                  columns={this.state.columns}
                ></ClusterChartWrapper>
              ) : (
                <DataTableWrapper
                  columns={this.state.columns}
                ></DataTableWrapper>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
