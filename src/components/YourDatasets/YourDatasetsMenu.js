import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { CSVLink } from 'react-csv';
import PropTypes from 'prop-types';
import '../../styles/YourDatasets/your-datasets-menu.css';

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
      <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}></MoreVertIcon>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
              
        {/* <MenuItem>
          <CSVLink data={props.data} className="save-as-csv-menu-item">
            <SaveAltIcon style={{marginRight: '.5vw'}}>
            </SaveAltIcon>Export as CSV</CSVLink>
        </MenuItem>  */}
        <MenuItem onClick={() => props.handleDeleteDataset(props.index)} style={{background: '#D72638', color: '#fff'}}><DeleteIcon style={{marginRight: '.5vw'}}></DeleteIcon>Delete Dataset</MenuItem>
      </Menu>
    </div>
  );
}

SimpleMenu.propTypes = {
  handleDeleteDataset: PropTypes.func,
  data: PropTypes.array,
  index: PropTypes.number
};
