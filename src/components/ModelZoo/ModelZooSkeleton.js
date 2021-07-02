import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import ModelZooSkeletonCard from './ModelZooSkeletonCard';

export default function ModelZooSkeleton() {
  return (
    <>
      <Skeleton variant="rect" width={'70vw'} height={70} />
      <Skeleton variant="text" width={'65vw'} height={30} />
      <Skeleton variant="text" width={'65vw'} height={30} />
      <Skeleton variant="text" width={'65vw'} height={30} />
      <div className="model-card-wrapper">
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
        <ModelZooSkeletonCard></ModelZooSkeletonCard>
      </div>
    </>
  );
}