import React, { useRef, useState, useEffect } from 'react';
import TestScatterPlot from './TestScatterPlot';

const ChartWrapper = () => {
  const chartArea = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    setChart(new TestScatterPlot(chartArea.current));
  }, [chart]);

  return <div className="chart-area" ref={chartArea}></div>;
};

export default ChartWrapper;
