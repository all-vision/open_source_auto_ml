import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';


export default function ModelDetailSkeleton() {

  /* 
    CONVERT THIS IN TO A CSS GRID. INSTEAD OF USING FLEX BOX 

  */

  const flexRow = {
    display: 'flex',
    flexDirection: 'row'
  };

  const flexColumn = {
    display: 'flex',
    flexDirection: 'column'
  };
  return (
    <div className="model-detail-skeleton-wrapper">
      <div>
        <Skeleton variant="rect" width={'60vw'} height={70} />
        <Skeleton variant="text" width={'60vw'} height={30} />
        <div style={{...flexRow, marginTop: '1vh'}}>
          <Skeleton variant="rect" width={'15vw'} height={40}  />
          <Skeleton variant="rect" width={'15vw'} height={40} style={{marginLeft: '1vw'}} />
          <Skeleton variant="rect" width={'15vw'} height={40} style={{marginLeft: '1vw'}} />
          <Skeleton variant="rect" width={'15vw'} height={40} style={{marginLeft: '1vw'}} />
        </div>
        <div style={flexRow}>
          <Skeleton variant="rect" width={'50vw'} height={500} style={{marginTop: '2vh', marginRight: '1vh'}} />
          <div style={flexColumn}>
            <Skeleton variant="rect" width={'25vw'} height={240} style={{marginTop: '2vh',}} />
            <Skeleton variant="rect" width={'25vw'} height={240} style={{marginTop: '2vh', marginTop: '1.5vh'}} />
          </div>
        </div>
        <Skeleton variant="rect" width={'75vw'} height={300} style={{marginTop: '2vh',}} />
      </div>
    </div>
  );
}