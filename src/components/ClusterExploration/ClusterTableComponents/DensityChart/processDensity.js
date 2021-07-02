import * as jStat from 'jstat';
function processDensity(step, precision, densityWidth, ...args) {
  let xiData = [];
  //process the xi
  function prcessXi(args) {
    let tempXdata = [];
    let tileSteps = 6; //Nbr of point at the top and end of the density
    let min = Infinity,
      max = -Infinity;

    //process the range of the data set
    args.forEach((e) => {
      min = Math.min(min, Math.min(...e));
      max = Math.max(max, Math.max(...e));
    });

    for (let i = min - tileSteps * step; i < max + tileSteps * step; i++) {
      tempXdata.push(i);
    }
    return tempXdata;
  }
  xiData = prcessXi(args);

  //the KDE gaussian function
  function kdeProcess(xi, u) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(Math.pow(xi - u, 2) / -2);
  }
  let gap = -1;
  //create the upper and lower line of the desnity
  function density(dataSource) {
    let data = [];
    let N = dataSource.length;

    gap++;
    for (let i = 0; i < xiData.length; i++) {
      let temp = 0;
      for (let j = 0; j < dataSource.length; j++) {
        temp = temp + kdeProcess(xiData[i], dataSource[j]);
      }
      data.push([xiData[i], (1 / N) * temp]);
    }

    return data.map((densityPoint, i) => {
      if (densityPoint[1] > precision) {
        return [xiData[i], gap, densityPoint[1] * densityWidth + gap];
      } else {
        return [xiData[i], null, null];
      }
    });
  }

  let results = [];
  let stat = [];
  let index = 0;

  args.forEach((e) => {
    results.push([]);
    stat.push([]);
    results[index] = density(e).slice();
    //Min, Q1, Median, Q3, Max
    stat[index].push(
      Math.min(...e),
      jStat.quartiles(e)[0],
      jStat.quartiles(e)[1],
      jStat.quartiles(e)[2],
      Math.max(...e)
    );
    index++;
  });
  return { xiData, results, stat };
}

export default processDensity;