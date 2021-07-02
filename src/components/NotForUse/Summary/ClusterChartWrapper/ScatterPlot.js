/* eslint-disable react/prop-types */
import React from 'react';
import C3Chart from 'react-c3js';
import '../../../styles/SummaryPage/scatterplot.css';
import 'c3/c3.css';

export default class ScatterPlot extends React.Component {

    state = {
      data: {
        columns: [],
        type: 'scatter',
      }
    }
    
    size = {
      width: 500,
      height: 500,
    }
      axis = {
        x: {
          min: -200,
          max: 200,
          show: false
        },
        y: {
          min: -200,
          max: 200,
          show: false
        }
      }
    
      componentDidMount() {
        const columns = this.props.columns;
        const newColumns = [];
        columns.forEach(column => {
          let newArray = [column.columnName, ...column.data];
          newColumns.push(newArray);
        });
        this.setState(prevState => ({
          data: {
            columns: newColumns,
            type: 'scatter'
          }

        }));

      }
      render() {
        return(
          <C3Chart 
            className="scatterplot"
            data={this.state.data} 
            axis={this.axis}
            size={this.size} 
            regions={this.regions}
          />
        );
      }
}