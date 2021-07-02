import React from 'react';
// import ViolinPlot from './ViolinPlot/ViolinPlot';
// import BoxPlot from './BoxPlot/BoxPlot';
import DensityChart from './DensityChart/DensityChart';
import Button from '@material-ui/core/Button';
import SlideToggle from 'react-slide-toggle';
import PropTypes from 'prop-types';

import '../../../styles/ClusterExploration/cluster-table-wrapper.css';
function ClusterTableRow(props) {
  /**
   * Props
   *
   * columnHeader: String
   * clusterData: Array[ClusterObj]
   *
   *
   * ------------------
   *
   * ClusterObj: {
   *  clusterName: String
   *  color: "rgba()"
   *  columnData: Array[Number]
   * }
   */

  if (props.clusterData === undefined) {
    return <p>loading</p>;
  }
  return (
    <SlideToggle
      duration={0}
      style={{border: '1px solid red'}}
      collapsed={props.collapsed}
      render={({ toggle, setCollapsibleElement }) => (
        <div className="cluster-violin-plot-wrapper">
          <Button className="cluster-violin-plot-button" onClick={toggle}>
            Toggle - Density Plot for Column: &nbsp;<b style={{color: '#1565C0'}}>{props.columnHeader}</b>
          </Button>
          <div ref={setCollapsibleElement}>
            <DensityChart {...props} />
          </div>
        </div>
      )}
    />
  );
}

export default ClusterTableRow;

ClusterTableRow.propTypes = {
  columnHeader: PropTypes.string.isRequired,
  clusterData: PropTypes.object.isRequired,
  collapsed: PropTypes.bool.isRequired,
};