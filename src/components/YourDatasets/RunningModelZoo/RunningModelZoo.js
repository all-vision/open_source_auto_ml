/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import RunningModelZooCheckmark from './RunningModelZooCheckmark';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SucessMessageCheckIcon from './SucessMessageCheckIcon';
import '../../../styles/YourDatasets/running-model-zoo.css';
import { seriesType } from 'highcharts';

const useStyles = makeStyles({
  root: {
    color: '#1565C0',
  },
});

export default function RunningModelZoo(props) {
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [initServersDone, setInitSeversDone] = useState(false);
  const [umapDone, setUmapDone] = useState(false);
  const [modelZooIsDone, setModelZooIsDone] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInitSeversDone(true);
      setTimeout(() => {
        setProgress(33);
      }, 1000);
    }, 2000);
  }, []);

  useEffect(() => {
    // alert('start umap');
    if (initServersDone) {
      setTimeout(() => {
        setUmapDone(true);
        setTimeout(() => {
          setProgress(66);
        }, 1000);
      }, 3500);
    }
  }, [initServersDone]);

  useEffect(() => {
    if (initServersDone && umapDone) {
      // check when processingData is finished
      if (props.processingData === false) {
        setTimeout(() => {
          setModelZooIsDone(true);
          setProgress(100);
          setTimeout(() => {
            setShowSuccessMessage(true);
          }, 2000);
        }, 3000);
      }
    }
    // return () => {
    //   setInitSeversDone(false);
    //   setUmapDone(false);
    //   setModelZooIsDone(false);
    // };

  }, [props.processingData, initServersDone, umapDone]);

  useEffect(() => {
    if (showSuccessMessage) {
      setTimeout(() => {
        props.handleRedirectUserToModelZoo();
      }, 1750);
    }
  }, [showSuccessMessage]);

  if (showSuccessMessage) {
    return (
      <section className='running-model-zoo-container'>
        <div className='running-model-zoo-wrapper success'>
          <div className='running-model-zoo-success-wrapper-header'>
            {/* <CheckCircleIcon className='running-model-zoo-success-icon' /> */}
            <SucessMessageCheckIcon />
            <h1>You&apos;re all set!</h1>
          </div>
          <p className='model-zoo-success-paragraph'>
            Redirecting you to the Model Zoo now...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='running-model-zoo-container'>
      <div className='running-model-zoo-wrapper'>
        <div className='running-model-zoo-header'>
          <p className='running-model-zoo-title'>
        Running 12 unsupervised, weakly supervised, and semi-supervised machine learning algorithms on your dataset.
          </p>
        </div>
        <div className='running-model-zoo-section-container'>
          <div className='running-model-zoo-section'>
            {
              initServersDone
                ?
                <RunningModelZooCheckmark />
                :
                <CircularProgress 
                  thickness={2}
                  className='running-model-zoo-spinner'
                />
            }
          </div>
          <div className='running-model-zoo-section'>
            {
              (() => {
                if (initServersDone) {
                  if (umapDone) {
                    return (
                      <RunningModelZooCheckmark />
                    );
                  } else {
                    return (
                      <CircularProgress 
                        thickness={2}
                        className='running-model-zoo-spinner'
                      />
                    );
                  }
                }
              })()
            }
          </div>
          <div className='running-model-zoo-section'>
            {
              (() => {
                if (initServersDone && umapDone) {
                  if (modelZooIsDone) {
                    return (
                      <RunningModelZooCheckmark />
                    );
                  } else {
                    return (
                      <CircularProgress 
                        thickness={2}
                        className='running-model-zoo-spinner'
                      />
                    );
                  }
                }
              })()
            }
          </div>
        </div>
        <div className='running-model-zoo-text-wrapper'>
          <div className='running-model-zoo-text-section'><p>Initialize Servers</p></div>
          <div className='running-model-zoo-text-section'><p>Run UMAP</p></div>
          <div className='running-model-zoo-text-section'><p>Run Model Zoo</p></div>
        </div>
        <progress
          value={progress}
          className="running-model-zoo-progress-bar"
          max="100"
        ></progress>
      </div>
    </section>
  );
}