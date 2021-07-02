import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import '../../../styles/ClusterExploration/cluster-table-wrapper.css';

function ClusterTableLoading(props) {
  return (
    <div className='cluster-table-directions loading'>
      <div className='comparing-clusters-loading-wrapper'>
        <CircularProgress className='cluster-table-loading__spinner' size={50}/>
        <div className='cluster-table-loading__text'>
          <h3>{props.clusterTableLoadingCopy}</h3>
          <p>Generating density plots for the columns where the selected clusters differ the most.</p>
        </div>
      </div>
    </div>
  );
  
}

export default ClusterTableLoading;

ClusterTableLoading.propTypes = {
  clusterTableLoadingCopy: PropTypes.string,
};

