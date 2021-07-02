import React from 'react';
import PropTypes from 'prop-types';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
function ClusterTableError(props) {
  return (
    <div className='cluster-table-directions error'>
      <div className='cluster-table-directions-header'>
        <div className='comparing-clusters-loading-wrapper error'>
          <ErrorOutlineOutlinedIcon className='cluster-table-error-icon' size={100} fontSize={'large'}/>
          <h3>{props.error}</h3>
        </div>
      </div>
    </div>
  );
}

export default ClusterTableError;
ClusterTableError.propTypes = {
  error: PropTypes.string
  // error: {
  //   message: PropTypes.string.isRequired,
  // }
};