import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../styles/ModelZoo/circular-loader.css';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginTop: '3vh',
      flexDirection: 'column',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }),
);

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h3 className="circular-loader-wrapper-title ">Loading Models</h3>
      <CircularProgress style={{color: '#1565C0', marginTop: '1vh'}}/>
    </div>
  );
}