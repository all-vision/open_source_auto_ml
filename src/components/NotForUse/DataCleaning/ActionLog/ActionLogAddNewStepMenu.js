import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        className="add-new-step-button action-log-header-item"
      >
        New Step
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} value={'clustering'}>
          Do not user for clusterng
        </MenuItem>
        <MenuItem onClick={handleClose} value={'select_label'}>
          Select as Label
        </MenuItem>
        <MenuItem onClick={handleClose} value={'one_hot_encode'}>
          One Hot Encode
        </MenuItem>
        <MenuItem onClick={handleClose} value={'drop_columns'}>
          Drop Columns
        </MenuItem>
      </Menu>
    </div>
  );
}
