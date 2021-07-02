import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

/*
* while settings page is loading render skeleton components
*/
export default function SettingsSkeleton() {
  return (
    <>
      <Skeleton variant="text" width={'10vw'} height={70} />
      <Skeleton variant="rect" width={'75vw'} height={200} style={{marginTop: '1.5vh'}} />
      <Skeleton variant="rect" width={'75vw'} height={100} style={{marginTop: '1.5vh'}} />
      <Skeleton variant="rect" width={'75vw'} height={100} style={{marginTop: '1.5vh'}} />
    </>
  );
}