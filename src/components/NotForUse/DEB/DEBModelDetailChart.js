/* eslint-disable react/prop-types */
import React from 'react';
import { Scatter } from '@reactchartjs/react-chart.js';

const ScatterChart = (props) => (
  (
    <>
      <div className="model-detail-scatterplot">
        <Scatter data={props.data} options={props.options} />
      </div>
    </>
  )
);

export default ScatterChart;
