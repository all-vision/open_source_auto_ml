/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MoreVertIcon
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        value={4}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => props.handleStopModel('stop_deployed', props.index)}
          value="stop_deployed"
          index={props.index}
        >
          {props.model.modelIsDeployed ? 'Stop Deployment' : 'Restart Deployment'}
        </MenuItem>
        <MenuItem
          onClick={() => props.handleOpenAPIAcessModal(props.index)}
        >
          Access API
        </MenuItem>
        <MenuItem
          onClick={() => props.handleDestroyModel(props.index)}
          style={{ background: '#D72638', color: '#fff' }}
        >
          Destroy
        </MenuItem>
      </Menu>
    </div>
  );
}
