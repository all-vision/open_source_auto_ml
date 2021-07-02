/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import color_palette from './ColorPalette';
import FilteringLoadingScreen from '../ModelDetails/FilteringLoadingScreen';
import '../../styles/ModelDetails/scatterplot-tooltip.css';
require('highcharts/modules/exporting')(Highcharts);
HighchartsBoost(Highcharts);
import HighchartsBoost from 'highcharts/modules/boost';
import '../../styles/tooltip.css';

const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

/*
  * scatterplot component to visualize machine learning models
  * uses Highcharts
  */
function Scatterplot(props) {

  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      panning: {
        enabled: true,
        type: 'xy',
      },
      panKey: 'shift',
      spacingBottom: 15,
      spacingTop: 10,
      spacingLeft: 10,
      spacingRight: 10,
      height: 600,
      reflow: false,
      animation: false,
      style: {
        fontFamily: 'Open Sans',
      },
    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen'],
        },
      },
      menuItemDefinitions: {
        viewFullscreen: {
          textKey: 'viewFullscreen',
        }}
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
    yAxis: {
      title: '',
      gridLineColor: '#eee',
    },
    // * old stable tooltip
    tooltip: {
      enabled: props.enableScatterplotTooltip,
      className: 'scatterplot-tooltip',
      style: {
        fontSize: '.8rem',
        whiteSpace: 'normal',
        width: '150px',
        height: '50px',
        padding: '50px',
        textOverflow: 'clip',
        color: '#323748',
        fontFamily: 'Open Sans, Lato, Roboto',
      },
      backgroundColor: '#eee',
      formatter: function () {
        let str = '';
        str += `<b>Cluster:</b> ${this.point.cluster}</b><br>`;
        str += `<b>X:</b> ${this.point.x}</b><br>`;
        str += `<b>Y:</b> ${this.point.y}</b><br>`;
        for (let index = 0; index < props.columnHeaders.length; index++) {
          // if (index < 10 )
          if (props.columnHeaders[index]) {
            str += `<b style={{width: '150px', whiteSpace: 'normal'}}>${props.columnHeaders[index]}</b>:<span style={{marginLeft: '20px'}}>${this.point.options[index]}</span><br>`;
          }
        }
        return `
            <div className='scatterplot-tooltip'>
                ${str}
          </div>
            `;
      },
      // outside: true,
      animation: false,
    },
    // ! HTML TOOLTIP WORK IN PROGRESS
    // tooltip: {
    //   enabled: props.enableScatterplotTooltip,
    //   className: 'scatterplot-tooltip',
    //   padding: 5,
    //   shadow: false,
    //   borderWidth: 0,
    //   useHTML: true,
    //   valueDecimals: 3,
    //   style: {
    //     'z-index': '9999',
    //     textOverflow: 'ellipsis',
    //     overflow: 'hidden'
    //   },
    //   formatter: function () {
    //     console.log('props.columnHeaders: ', props.columnHeaders);
    //     let str = '';
    //     str += `<h3><b>Cluster:</b> ${this.point.cluster}</b><br></h3>`;
    //     for (let index = 0; index < props.columnHeaders.length; index++) {
    //       if (props.columnHeaders[index] && index < 10) {
    //         str += `<div class='scatterplot-tooltip-row'><b class='scatterplot-tooltip__key'>${props.columnHeaders[index]}:</b><span class='scatterplot-tooltip__value'>${this.point.options[index]}</span><br></div>`;
    //       }
    //     }
    //     return `
    //         <div>
    //             ${str}
    //         </div>
    //         `;
    //   },
    //   outside: true,
    //   animation: false,
    // },
    // TODO NEW TOOLTIP IN DEV FOR IMAGES
    // tooltip: {
    //   className:'scatterplot-image-tooltip',
    //   useHTML: true,
    //   valueDecimals: 3,
    //   style: {
    //     zIndex: 9999,
    //   },
    //   formatter: function() {
    //     console.log('this: ', this.point[0]);
    //     let str = '';
    //     str += this.point[0];
    //     return (
    //       `
    //       <div>
    //       <img src="https://images.unsplash.com/photo-1593642532009-6ba71e22f468?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" height="300" width="300" />
    //       </div>
    //       `
    //     );
    //   },
    // },
    title: {
      text: undefined,
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      floating: true,
      itemDistance: 50,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 6,
      enabled: false,
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        stickyTracking: false,
        scatter: {
          animation: false,
          enableMouseTracking: false,
          stickyTracking: false,
          shadow: false,
          dataLabels: { style: { textShadow: false } },
        },
        turboThreshold: 0, 
        state: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    series: props.chartData,
  };

  if (props.isFiltering) {
    return (
      <FilteringLoadingScreen
        isFiltering={props.isFiltering}
        filterLoadingText={props.filterLoadingText}
      />
    );
  }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export default Scatterplot;
