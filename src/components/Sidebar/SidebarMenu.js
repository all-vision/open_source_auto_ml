import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SSOLogout from './SSOLogout';
import PropTypes from 'prop-types';

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="logout-sidebar-menu">
        <ExpandMoreIcon
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        ></ExpandMoreIcon>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem className="sidebar-logout-item">
            <SSOLogout routeProps={props.routeProps}></SSOLogout>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}

SimpleMenu.propTypes = {
  routeProps: PropTypes.object,
};