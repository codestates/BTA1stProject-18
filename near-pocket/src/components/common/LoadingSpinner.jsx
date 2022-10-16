import { CircularProgress, Backdrop } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <Box>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  );
};

export default LoadingSpinner;
