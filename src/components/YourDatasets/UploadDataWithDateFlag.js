import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
      marginBottom: '2vh',
    },
  },
}));

export default function SimpleAlerts(props) {
  const classes = useStyles();

  return (
    <div variant="outlined" className={useStyles.root}>
      <Alert
        severity="info"
        variant="outlined"
        icon={false}
        style={{ marginBottom: '2vh',background: '#e8f4fd', overflowX: 'hidden' }}
      >
        <div style={{display:'flex', flexDirection: 'row'}}>
          <InfoOutlinedIcon style={{color:'#41a3f5'}} fontSize={'default'}></InfoOutlinedIcon>
          <AlertTitle style={{marginTop: '.15vh', marginLeft: '.4vw'}}>Heads Up</AlertTitle>
        </div>
        <div>
          <p>
          If you plan to use the Detect Emerging Behaviors Feature to quickly find patterns that emerge in your data over time, please re-title your date/time column &rsquo;data_data&rsquo; and upload below. Otherwise, explore our sample data sets to see Detect Emerging Behaviors in action. 
          </p>
          <Button 
            onClick={() => props.setUploadDataWithDateFlagIsOpen(false)}
            variant='outlined'
            style={{
              fontSize: '.8rem',
              marginTop: '1vh',
              fontFamily: 'Open Sans',
              textTransform: 'capitalize'
            }}
          >Hide Message</Button>
        </div>
      </Alert>
    </div>
  );
}

SimpleAlerts.propTypes = {
  setUploadDataWithDateFlagIsOpen: PropTypes.func,
};
  