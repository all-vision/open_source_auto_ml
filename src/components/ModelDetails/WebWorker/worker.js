export default function worker() {
  self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals

    // grab inputs from ModelDetailsWrapper.js
    const targetClusters = e.data.targetClusters;
    const existingData = e.data.existingData;
    const existingTableData = e.data.existingTableData;
    const originalFormattedChartData = e.data.originalFormattedChartData;
    const cloneDeep = e.data.cloneDeep;
    
    // filter data for table
    const filteredTableData = existingTableData.filter((d) =>
      targetClusters.includes(d.cluster)
    );
    
    // filter data for chart
    // let test = cloneDeep(originalFormattedChartData);
    let formattedData = originalFormattedChartData.filter((t) => targetClusters.includes(t.cluster));
    
    const filteredData = {
      filteredTableData: filteredTableData,
      filteredChartData: formattedData
    };

    postMessage(filteredData);
  });
}

