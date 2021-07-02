import React from 'react';
import Button from '@material-ui/core/Button';
import '../../styles/SummaryPage/summary-page-buttons.css';

export default function SummaryPageButtons() {
  return (
    <div className="summary-page-buttons-wrapper">
      <Button variant="contained" color="primary">Run model zoo</Button>
      <Button variant="contained" color="default" className="summary-page-export-as-csv">export as csv</Button>
    </div>
  );
}