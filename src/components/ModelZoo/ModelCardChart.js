/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from 'highcharts/modules/boost';
import color_palette from '../Shared/ColorPalette';

require('highcharts/modules/exporting')(Highcharts);
HighchartsBoost(Highcharts);


function HighChart(props) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let formattedData = [];
    props.chartClusters.forEach((cluster) => {
      if (cluster > 10) {
        return;
      }
      const filteredData = props.chartData.filter((data) => data.cluster === cluster);
      formattedData.push({
        name: `Cluster ${cluster + 1}`,
        color: cluster === -1 ? '#cccccc' : color_palette[cluster],
        marker: {
          symbol: 'circle'
        },
        data: filteredData
      });
    });
    setChartData(formattedData);
  }, [props]);

  const options = {
    chart: {
      type: 'scatter',
      panning: {
        enabled: false,
        type: 'xy'
      },
      animation: false,
      panKey: 'shift',
      spacingBottom: 0,
      style: {
        fontFamily: 'Open Sans',
      },
      spacingTop: 10,
      spacingLeft: 10,
      spacingRight: 10,
      height: 300,

    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true
    },
    plotOptions: {
      scatter: { turboThreshold: 0, animation: false, enableMouseTracking: false, stickyTracking: false, shadow: false, dataLabels: { style: { textShadow: false } } },
      series: {
        boostThreshold: 1,
      }
    },
    exporting: {
      enabled: false
    },
    responsive: {  
      rules: [{  
        condition: {  
          maxWidth: 500  
        },  
        chartOptions: {  
          legend: {  
            enabled: false  
          }  
        }  
      }]  
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false,
      title: '',
    },
    tooltip: {
      enabled: false,
      animation: false
    },
    title: {
      text: undefined
    },
    credits: {
      enabled: false
    },
    legend:{
      align: 'center',
      verticalAlign: 'top',
      floating: true,
      itemDistance: 50,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 6,
      enabled: false        
    },
    series: chartData,
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
}
 
export default HighChart;