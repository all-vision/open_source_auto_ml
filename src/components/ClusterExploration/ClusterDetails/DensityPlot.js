/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
// import processViolin from './ClusterTableComponents/ViolinPlot/processViolin';
import processDensity from './processDensity';
// import violinData from './ClusterTableComponents/ViolinPlot/test-violin.json';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more';
import color_palette from '../../Shared/ColorPalette';
import '../../../styles/ClusterExploration/cluster-details-wrapper.css';
HC_more(Highcharts);

export default function ViolinPlot(props) {
  const [targetClusterData, setTargetClusterData] = useState([]);
  const [allOtherClusterData, setAllOtherClusterData] = useState([]);
  const [stat, setStat] = useState([]);
  const [xi, setXi] = useState([]);
  const [seriesLines, setSeriesLines] = useState([]);
  const [seriesCoef, setSeriesCoef] = useState([]);
  const [series, setSeries] = useState([]);

  let mColor = '#000000',
    qColor = '#0000CD',
    medianColor = '#DC143C';

  useEffect(() => {
    let targetClusterData = [],
      allOtherClusterData = [];

    const filteredDataByColumn = props.dataForViolin.filter((d) => d.column === props.column);
    filteredDataByColumn.forEach((elm) => {
      // t.push(elm.columnValue);
      if (elm.cluster === props.cluster) {
        targetClusterData.push(elm.columnValue);
      } else {
        allOtherClusterData.push(elm.columnValue);
      }
    });

    //Process violin data
    let step = 1,
      //   precision = 0.00000000001, // default precision value
      precision = 0.00000000001,
      width = 1;

    let data = processDensity(
      step,
      precision,
      width,
      targetClusterData,
      allOtherClusterData,
    );

    //Structure the data to create the chart
    let chartsNbr = data.results.length;
    let xi = data.xiData;
    let stat = data.stat;
    let targetClusterDataResults = data.results[0],
      allOtherClusterDataResults = data.results[1];

      
    let statData = [];
    let mColor = '#000000',
      qColor = '#0000CD',
      medianColor = '#DC143C';
    stat.forEach((e, i) => {
      statData.push([]);
      statData[i].push(
        {
          x: stat[i][0],
          y: i,
          name: 'Min',
          marker: {
            fillColor: mColor
          }
        },
        {
          y: i,
          x: stat[i][1],
          name: 'Q1',
          marker: { fillColor: '#000000', radius: 4 }
        },
        {
          y: i,
          x: stat[i][2],
          name: 'Median',
          marker: { fillColor: '#000000', radius: 5 }
        },
        {
          y: i,
          x: stat[i][3],
          name: 'Q3',
          marker: { fillColor: '#000000', radius: 4 }
        },
        { y: i, x: stat[i][4], name: 'Max', marker: { fillColor: '#000000' } }
      );
    });

    //Create the series
    let dataSeries = [],
      series = [];
    data.results.forEach((e, i) => {
      dataSeries.push([]);
      dataSeries[i] = e;
      series.push({
        data: dataSeries[i],
        color:  i === 0 ? color_palette[props.cluster] : '#C2C2C2',
        name: `${props.cluster}`,
        zIndex: 1
      });
    });
    setSeries(series);


    let statCoef = [];
    for (let col = 0; col < 5; col++) {
      statCoef.push([]);
      for (let line = 0; line < data.results.length; line++) {
        statCoef[col].push([(stat[line][col]), (line)]);
      }
    }

    setSeriesLines(statData.map(dataPt => {
      return {
        type: 'line',
        data: dataPt,
        color: '#000'
      };
    }));

    setSeriesCoef([
      {
        type: 'scatter',
        data: statCoef[0],
        name: 'Min',
        color: mColor
      },
      {
        type: 'scatter',
        data: statCoef[1],
        name: 'Q 1',
        color: qColor
      },
      {
        type: 'scatter',
        data: statCoef[2],
        name: 'Median',
        color: medianColor
      },
      {
        type: 'scatter',
        data: statCoef[3],
        name: 'Q 3',
        color: qColor
      },
      {
        type: 'scatter',
        data: statCoef[4],
        name: 'Max',
        color: mColor
      }
    ]);

    setStat(stat);
    setXi(xi);
    setTargetClusterData(targetClusterDataResults);
    setAllOtherClusterData(allOtherClusterDataResults);
  }, [props.column, props.dataForViolin, props.cluster]);

  const options = {
    chart: {
      type: 'areasplinerange',
      inverted: false,
    },
    tooltip: {
      enabled: false
    },
    // boost: {
    //   useGPUTranslations: true,
    //   usePreAllocated: true
    // },
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
      title: { text: null },
      visible: false,
      // categories: [`Cluster ${props.cluster}`, 'All other clusters'],
      categories: [],
      startOnTick:false,
      endOnTick:false,
      gridLineWidth: 0
    },
    xAxis: {
      reversed: false,
      // gridLineWidth: 1,
      // gridLineColor: '#eee',
      labels: { format: '{value}' }
    },
    title: {
      text: props.column,
      align: 'left'
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
    plotOptions: {
      series: {
        // stacking: 'normal',
        marker: {
          enabled: false
        },
        line: {
          marker: {
            enabled: false
          },
          showInLegend: true,
          color: '#232b2b',
          lineWidth: 5,
          dashStyle: 'shortdot'
        },
        // scatter: {
        //   marker: {
        //     enabled: true,
        //     symbol: 'diamond'
        //   }
        // },
        states: {
          hover: {
            enabled: false
          }
        },
        pointStart: xi[0],
        events: {
          legendItemClick: function (e) {
            e.preventDefault();
          }
        }
      }
    },
    series: series,
    // series: series.concat(seriesLines).concat(seriesCoef),
    credits: {
      enabled: false
    },
  };

  return (
    <div 
      className='density-plot-and-stats-wrapper'
    // style={{
    //   marginTop: '2vh',
    //   display: 'flex',
    //   flexDirection: 'row'
    // }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} containerProps = {{ 
        className: props.class === 'other-clusters' ? 'density-plot other-clusters' : 'density-plot'
      }} />
      {(() => {
        if (stat.length > 0) {
          return (
            <div className='cluster-stats-container'>
              <div className='cluster-stats-wrapper' style={{
                borderTop: `5px solid ${color_palette[props.cluster]}`
              }}>
                <h3>Cluster {props.cluster} Statistics</h3>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Min:</p>
                  <p className='cluster-stats-value'>{stat[0][0]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Quartile 1:</p>
                  <p className='cluster-stats-value'>{stat[0][1]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Median:</p>
                  <p className='cluster-stats-value'>{stat[0][2]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Quartile 3:</p>
                  <p className='cluster-stats-value'>{stat[0][3]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Max:</p>
                  <p className='cluster-stats-value'>{stat[0][4]}</p>
                </div>
              </div>
              <div className='cluster-stats-wrapper' style={{
                borderTop: '5px solid #c2c2c2'
              }}>
                <h3>All Other Clusters Statistics</h3>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Min:</p>
                  <p className='cluster-stats-value'>{stat[1][0]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Quartile 1:</p>
                  <p className='cluster-stats-value'>{stat[1][1]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Median:</p>
                  <p className='cluster-stats-value'>{stat[1][2]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Quartile 3:</p>
                  <p className='cluster-stats-value'>{stat[1][3]}</p>
                </div>
                <div className='cluster-stats-row'>
                  <p className='cluster-stats-key'>Max:</p>
                  <p className='cluster-stats-value'>{stat[1][4]}</p>
                </div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })()}
    </div>
  );
} 