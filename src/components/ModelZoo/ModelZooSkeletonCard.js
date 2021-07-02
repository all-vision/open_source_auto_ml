import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

export default function ModelZooSkeletonCard() {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Skeleton variant="rect" width={'22vw'} height={250} style={{marginRight: '2rem', marginTop: '2vh'}}  />
      <Skeleton variant="text" width={'22vw'} height={40} />
      <Skeleton variant="text" width={'22vw'} height={20} />
      <Skeleton variant="text" width={'22vw'} height={20} />
      <Skeleton variant="text" width={'22vw'} height={20} />
      <Skeleton variant="text" width={'22vw'} height={20} />
    </div>
  );
}