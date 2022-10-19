import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import '../App.css';
import { AdvancedChart } from "react-tradingview-embed";
import Link from '@mui/material/Link';

function GraphicDialog(props) {
  const { onClose, selectedValue, open, onMove, onMoveBack} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth={false}>
      <Box
        sx={{
         display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <div style={{margin:"2px 1px 2px 1px", overflow:"hidden"}} >
          <AdvancedChart widgetPropsAny={{
            "range": "12M", "theme": "dark", "symbol": selectedValue, "width": "1000px", "height": "600px", "allow_symbol_change": false, "studies": [
              {
                "id": "MAExp@tv-basicstudies",
                "version": 60,
                "inputs": {
                  "length": 20,
                }
              },
              {
                "id": "MAExp@tv-basicstudies",
                "version": 60,
                "inputs": {
                  "length": 10,
                }
              }]
          }} />
        </div>
      </Box>
      <b>{selectedValue}</b>
      Actual : <Link style={{display:"contents", cursor:"pointer"}} onClick={onMoveBack}>&lt;&lt;Last </Link> - <Link style={{display:"contents", cursor:"pointer"}} onClick={onMove}>Next &gt;&gt;</Link>
    </Dialog>
  );
}

TradingViewDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function TradingViewDialog(props) {
  const onClose = props.onClose;
  const onMove = props.onMove;
  const onMoveBack = props.onMoveBack;
  
  const [open, setOpen] = React.useState(props.open);
  
  const handleClose = (value) => {
    setOpen(false);
    onClose();
  };


  return (
    <div>
      <GraphicDialog
        selectedValue={props.selectedValue}
        open={props.open}
        onClose={handleClose}
        setOpen={setOpen}
        setSelectedValue={handleClose}
        onMove={onMove}
        onMoveBack={onMoveBack}
      />
    </div>
  );
}
