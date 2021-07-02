/* eslint-disable react/prop-types */
import React from 'react';
import { Line } from '@reactchartjs/react-chart.js';

const LineChart = (props) => {
  const data = {
    labels: ['12', '1', '1', '1', '1', '1', '1', '1', '1.5', '1.5'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1.5],
        fill: false,
        backgroundColor: 'rgba(21, 101, 194, 1)',
        borderColor: 'rgba(21, 101, 194, 1)',
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 10,
        right: 50,
        top: 25,
        bottom: 20,
      },
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            fontFamily: 'Open Sans',
            labelString: `${props.elbowChartDropdownValue}`,
          },
          gridLines: {
            color: '#eee',
            lineWidth: '1',
            drawBorder: false,
            zeroLineWidth: '.5',
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of Clusters',
          },
          gridLines: {
            lineWidth: '1',
            zeroLineWidth: '.5',
            color: '#eee',
            drawBorder: false,
          },
        },
      ],
    },
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};
export default LineChart;
