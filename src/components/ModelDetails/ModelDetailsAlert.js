import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const useStyles = makeStyles((theme) => ({
  root: {
    width: screenWidth < 1900 ? '65%' : '55%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

/*
* simple alert component to let the user know how to best interact with our scatterplot
*/
export default function SimpleAlerts() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  return (
    <div className={classes.root} style={{marginTop: '2vh'}}>
      <Collapse in={open}>
        <Alert
          severity="info"
          style={{background: '#E8F4FD'}}
          variant="outlined"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <b>Click and drag</b> to zoom in on portions of the chart, hold <b>shift</b> and drag to pan around the chart.
        </Alert>
      </Collapse>
    </div>
  );
}