import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner = () => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <CircularProgress size={50} color="secondary" />
  </div>
);

export default Spinner;
