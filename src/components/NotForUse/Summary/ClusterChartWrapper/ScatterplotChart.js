import React from 'react';
import { Scatter } from '@reactchartjs/react-chart.js';

const options = {
  layout: {
    padding: {
      left: 5,
      right: 5,
      top: 0,
      bottom: 5
    }
  },
  responsive: true,
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        display: false,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        display: false
      }
    ]
  },
};

const ScatterChart = () => (
  <>
    <div className='scatterplot-chart'>
      <Scatter data={DATA} options={options}  />
    </div>
  </>
);

export default ScatterChart;