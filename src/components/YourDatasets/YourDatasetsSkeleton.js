import React from 'react';
import { Skeleton } from '@material-ui/lab';


export default function YourDatasetsSkeleton() {
  return (
    <div style={{marginTop: '5vh'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Skeleton variant="rect" width={'20vw'} height={30}></Skeleton>
        <Skeleton variant="rect" width={'15vw'} height={30} style={{marginLeft: '2vw'}}></Skeleton>
      </div>
      <Skeleton variant="rect" width={'70vw'} height={50} style={{marginTop: '2vh'}}></Skeleton>
      <Skeleton variant="rect" width={'70vw'} height={25} style={{marginTop: '2vh'}}></Skeleton>
      <Skeleton variant="rect" width={'70vw'} height={25} style={{marginTop: '2vh'}}></Skeleton>
    </div>
  );
}