/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from 'highcharts/modules/boost';

require('highcharts/modules/exporting')(Highcharts);
HighchartsBoost(Highcharts);


function HighChart(props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      panning: {
        enabled: true,
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
      height: props.isClusterDetailsPage ? 600 : 300,

    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true
    },
    plotOptions: {
      series: {
        // stickyTracking: props.chartData[0].length > 100  ? true : false,
        stickyTracking: false,
        boostThreshold: 1,
        color: props.chartData.color,
        scatter: {
          animation: false,
          enableMouseTracking: false,
          marker: {
            enabled: true,
            symbol: 'diamond'
          },
          stickyTracking: false,
          shadow: false,
          dataLabels: { style: { textShadow: false } },
        },
        turboThreshold: 0, // Comment out this code to display error
        state: {
          hover: {
            enabled: false,
          },
        },
      },
      // scatter: {
      //   marker: {
      //     enabled: true,
      //     symbol: 'diamond'
      //   }
      // },
    },
    credits: {
      enabled: false
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
      visible: props.isClusterDetailsPage ? true : false
    },
    yAxis: {
      visible: props.isClusterDetailsPage ? true : false,
      title: '',
    },

    tooltip: {
      enabled: props.showToolTip ? true : false,
      // enabled: false,
      className: 'scatterplot-tooltip',
      style: {
        fontSize: '.8rem',
        whiteSpace: 'normal',
        width: '150px',
        height: '50px',
        padding: '50px',
        textOverflow: 'clip',
        color: '#333',
        fontFamily: 'Open Sans, Lato, Roboto',
      },
      // backgroundColor: '#1C2530',
      formatter: function () {

        let str = '';
        str += `<b>Cluster:</b> ${this.point.cluster}</b><br>`;
        str += `<b>X:</b> ${this.point.x}</b><br>`;
        str += `<b>Y:</b> ${this.point.y}</b><br>`;
        for (let index = 0; index < props.columnHeaders.length; index++) {
          // if (index < 10 )
          if (props.columnHeaders[index]) {
            str += `<b>${props.columnHeaders[index]}</b>:${this.point.options[index]}<br>`;
          }
        }
        return `
            <div className='scatterplot-tooltip'>
                ${str}
          </div>
            `;
      },
      animation: false,
      outside: true
    },
    title: {
      text: undefined
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      floating: true,
      itemDistance: 50,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 6,
      enabled: false
    },
    series: props.chartData,
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} containerProps={{className: 'cluster-scatterplot-wrapper'}} />
  );
}

export default HighChart;