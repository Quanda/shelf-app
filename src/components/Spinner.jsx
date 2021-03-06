import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner = props => (
  <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
    }}
  >
    <CircularProgress size={props.size || 75} color="primary" />
  </div>
);

export default Spinner;
