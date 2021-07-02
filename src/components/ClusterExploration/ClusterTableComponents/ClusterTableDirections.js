import React from 'react';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import LooksThreeIcon from '@material-ui/icons/Looks3';
function ClusterTableDirections() {
  return (
    <div className="cluster-table-directions">
      <div className="cluster-table-directions-header">
        <p><span>1.</span> Select two or more Clusters from the cards below</p>
      </div>
      <div className="cluster-table-directions-header">
        <p>
          <span>2.</span> Click <span className='cluster-table-direction-cta'>Compare Clusters</span> to view the top three most
          different columns between the selected clusters
        </p>
      </div>
      {/* <div className="cluster-table-directions-header"><LooksThreeIcon fontSize='large' />   <h4>Click &quot;Clear&quot; to reset the display</h4></div>     */}
    </div>
  );
}

export default ClusterTableDirections;
