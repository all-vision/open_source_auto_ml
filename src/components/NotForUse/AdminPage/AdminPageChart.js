import React, { useEffect, useState } from 'react';
import { Line } from '@reactchartjs/react-chart.js';
import color_palette from '../Shared/ColorPalette';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'chartjs-plugin-annotation';

const hexToRGBA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',.1)';
  }
  throw new Error('Bad Hex');
};

const generateLast7Days = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'];
  const goBackDays = 7;

  const today = new Date();
  let daysSorted = [];

  for(var i = 0; i < goBackDays; i++) {
    let newDate = new Date(today.setDate(today.getDate() - 1));
    daysSorted.unshift(days[newDate.getDay()]);
  }

};

const generateLast24Hours = () => {
  var hoursPerDay = 24;
  var time = [];
  var formattedTime;
  for(let i=0; i < hoursPerDay+1 ; i++){ //fill in all of the hours
    formattedTime = (moment().subtract(i, 'hours')).format('hA');  //give the time in format X AM/PM
    time.unshift(formattedTime);  //add to beginning of array
  }    
  return time;
};

const data = {
  labels: generateLast24Hours(),
  datasets: [
    {
      label: 'DB Scan',
      data: [12, 19, 33, 20, 27, 39, 21, 14, 54,1, 24, 64, 12, 19, 33, 20, 27,54,1, 124, 64, 12,12, 19, 33,],
      fill: true,
      pointRadius: 0,
      backgroundColor: hexToRGBA(color_palette[0]),
      borderColor: color_palette[0],
    },
    {
      label: 'Tree Cluster',
      data: [32, 29, 38, 41, 42, 81, 114, 54,1, 24, 64, 12, 19, 33, 20, 27, 29, 38, 41, 42, 81, 14, 54, 12, 37],
      fill: true,
      backgroundColor: hexToRGBA(color_palette[1]),
      pointRadius: 0,
      borderColor: color_palette[1],
    },
    {
      label: 'Random Forest',
      data: [42, 35, 125, 14, 67, 90,42, 35, 23, 14, 67, 90, 14, 67, 90,42, 35, 23,42, 35, 23, 14, 67, 90,42],
      fill: true,
      backgroundColor: hexToRGBA(color_palette[2]),
      pointRadius: 0,
      borderColor: color_palette[2],
    },
  ],
};


export default function LineChart(props) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  useEffect(() => {
    const currentSelectedTimeRange = props.selectedTimeRange;
    setSelectedTimeRange(currentSelectedTimeRange);
  }, [props.selectedTimeRange]);

  return (
    <>
      <Line data={props.deployed_models} options={props.options} />
    </>
  );
}

LineChart.propTypes = {
  selectedTimeRange: PropTypes.string,
  deployed_models: PropTypes.object,
  options: PropTypes.object
};

