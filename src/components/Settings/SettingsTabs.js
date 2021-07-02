/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';
import '../../styles/Settings/settings-tabs.css';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
    background: '#eee',
    width: '100%',
    overflow: 'hidden',
  },
  indicator: {
    backgroundColor: '#1565C0',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    opacity: 0.3,
    fontWeight: '600',
    marginRight: theme.spacing(4),
    fontFamily: ['Open Sans', 'Lato', 'Roboto'].join(','),
    '&:hover': {
      color: '#1565C0',
      opacity: 1,
    },
    '&$selected': {
      color: '#1565C0',
      opacity: 1,
    },
    '&:focus': {
      color: '#1565C0',
      opacity: 1,
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);


/* Use of Matrial UI makeStyles when all other components use regular css*/
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    marginLeft: '16vw',
    backgroundColor: theme.palette.background.paper,
    width: '84vw',
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
}));

/*
* tabs that live at the top of the Account & Settings page
*/
export default function CustomizedTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    props.handleChangeTabs(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.demo1}>
      <AntTabs value={value} onChange={handleChange} aria-label="ant example">
        <AntTab
          label="Account Settings"
          value={0}
          style={{ marginLeft: '3rem' }}
        />
        <AntTab label="Billing & Usage" name={1} />
        {/* <AntTab label="API Documentation" name={2} /> */}
      </AntTabs>
    </div>
  );
}
