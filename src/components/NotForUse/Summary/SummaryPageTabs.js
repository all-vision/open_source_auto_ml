/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
    background: '#eee',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    opacity: 0.4,
    fontWeight: '600',
    marginRight: theme.spacing(4),
    fontFamily: ['Nunito', 'Lato'].join(','),
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

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
    width: 5000,
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
}));

export default function CustomizedTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    props.handleUpdateActiveTab(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.demo1}>
      <AntTabs value={value} onChange={handleChange} aria-label="ant example">
        <AntTab
          label="Data Summary"
          value={0}
          style={{ marginLeft: '20rem' }}
        />
        <AntTab label="Cluster Chart" name={1} />
        <AntTab label="Data Table" name={2} />
      </AntTabs>
    </div>
  );
}
