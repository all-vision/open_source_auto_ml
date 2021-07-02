import React, { useEffect, useState } from 'react';
import processDensity from './processDensity';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

import PropTypes from 'prop-types';

export default function DensityChart(props) {
  const [seriesData, setSeriesData] = useState([]);
  const [stat, setStat] = useState([]);
  const [xi, setXi] = useState([]);
  useEffect(() => {
    let columnArrs = props.clusterData.map((cluster) =>
      cluster.columnData.map((x) => Number(x))
    );
    let padding = 1,
      precision = 0.00001,
      width = 1.3;
    let data = processDensity(padding, precision, width, ...columnArrs);

    let chartsNbr = data.results.length;
    let xi = data.xiData;
    let stat = data.stat;

    let dataSeries = [],
      series = [];

    data.results.forEach((e, i) => {
      dataSeries.push([]);
      dataSeries[i] = e;

      series.push({
        data: dataSeries[i],
        name: props.clusterData[i].clusterName,
        zIndex: chartsNbr - i,
        color: props.clusterData[i].color,
        fillColor: props.clusterData[i].color,
      });
    });


    
    setSeriesData(series);
    setStat(stat);
    setXi(xi);
  }, [props.clusterData]);


  const options = {
    chart: {
      type: 'areasplinerange',
      animation: true,
      height: '600px',


    },
    title: {
      text: ' ',
    },
    xAxis: {
      // height: 100,
    },

    yAxis: {
      title: { text: null },
      categories: props.clusterData.map((cluster) => cluster.clusterName),
      max: props.clusterData.length - 1,
      // labels: {
      //   formatter: function () {
      //     if (this.pos < chartsNbr) return this.value;
      //   },
      //   style: {
      //     textTransform: 'capitalize',
      //     fontSize: '9px',
      //   },
      // },
      startOnTick: true,
      gridLineWidth: 1,
      tickmarkPlacement: 'on',
    },
    // tooltip: {
    //   useHTML: true,
    //   shared: true,
    //   crosshairs: true,
    //   valueDecimals: 3,
    //   headerFormat: null,
    //   pointFormat: '<b>{series.name}</b>: {point.x} kg <br/>',
    //   footerFormat: null,
    // },
    tooltip: {
      style: {
        fontSize: '.8rem',
        whiteSpace: 'normal',
        width: '250px',
        height: '50px',
        padding: '50px',
        textOverflow: 'clip',
        color: '#333',
        fontFamily: 'Open Sans, Lato, Roboto',
      },
      formatter: function () {
        let str = '';
        str += `<h2>${this.series.name}</h2><br>`;
        str += `<b>Max:</b> ${stat[this.series.index][4]}<br>`;
        str += `<b>Quartile 3:</b> ${stat[this.series.index][3]}<br>`;
        str += `<b>Median:</b> ${stat[this.series.index][2]}<br>`;
        str += `<b>Quartile 1:</b> ${stat[this.series.index][1]}<br>`;
        str += `<b>Min:</b> ${stat[this.series.index][0]}<br>`;
        return `
        <div>
        ${str}        
        </div>
        `;
      }
    },
    plotOptions: {
      areasplinerange: {
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            enabled: false,
          },
        },
        pointStart: xi[0],
        animation: {
          duration: 0,
        },

        lineWidth: 3,
        color: 'black',
      },
    },
    legend: {
      enabled: false,
    },
    series: seriesData,
    credits: {
      enabled: false,
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options}/>;
}

DensityChart.propTypes = {
  name: PropTypes.string,
  columnHeader: PropTypes.string,
  clusterData: {
    data: PropTypes.array,
  },
};