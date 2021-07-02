/* eslint-disable react/prop-types */
import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(10),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default function CustomizedTooltips(props) {
  return (
    <div>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">To change the model used to detect emerging behaviors, assign a different model from the Find Similiar Datapoints page.</Typography>
          </React.Fragment>
        }
      >
        <h3 style={{marginLeft: '.5vw', fontWeight: 700, color: '#000', textDecoration: 'underline'}}>{props.model}</h3>
      </HtmlTooltip>
    </div>
  );
}