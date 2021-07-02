/* eslint-disable react/no-deprecated */
import React from 'react';
import DataTable2 from './DataTable2';
import titanic_data from '../../../data/titanic_data.csv';
import Papa from 'papaparse';
import Loading from '../../Shared/Loading';

export default class DataTableWrapper extends React.Component {
  state = {
    data: '',
  };

  componentWillMount() {
    this.getCsvData();
  }

  getData = (result) => {
    const slicedResult = result.data;
    this.setState({ data: slicedResult });
  };

  fetchCsv() {
    return fetch(titanic_data).then(function (response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');

      return reader.read().then(function (result) {
        return decoder.decode(result.value);
      });
    });
  }

  async getCsvData() {
    let csvData = await this.fetchCsv();

    Papa.parse(csvData, {
      complete: this.getData,
    });
  }

  render() {
    if (!this.state.data.length > 0) {
      return <Loading></Loading>;
    }
    return (
      <div className="summary-page-data-table-wrapper">
        <div className="summary-page-data-table">
          <DataTable2 titanic_data={this.state.data}></DataTable2>
        </div>
        <div className="other-thing"></div>
      </div>
    );
  }
}
