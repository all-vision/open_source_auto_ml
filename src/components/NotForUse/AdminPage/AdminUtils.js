import color_palette from '../Shared/ColorPalette';
import moment from 'moment';

const generateLastMonth = () => {
  const lastThirtyDays = [...new Array(30)].map((i, idx) => moment().startOf('day').subtract(idx, 'days'));
  let lastMonth = [];
  lastThirtyDays.forEach((timestamp) => {
    lastMonth.unshift(timestamp.toString().slice(0,15));
  });
  return lastMonth;
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
  
  return daysSorted;
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

export const formatDataForLineChart = (timeSelectValue, deployedModels) => {
  let datasets = [];
  deployedModels.forEach((model, index) => {
    datasets.push({
      label: model.modelName,
      data: model.usageData,
      pointRadius: 3,
      fill: true,
      backgroundColor: hexToRGBA(color_palette[index]),
      borderColor: color_palette[index]
    });
  });

  let label;
  if (timeSelectValue === 'This Week') {
    label = generateLast7Days();
  } 
  else if (timeSelectValue === 'This Month') {
    label = generateLastMonth();
  }
  else {
    label = generateLast24Hours();
  }
  const DATA = {
    labels: label,
    datasets
  };

  return DATA;
};


/*
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
*/