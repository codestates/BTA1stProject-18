import { Box } from '@mui/system';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton, Typography } from '@mui/material';

const PageHeader = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideBackButton = location.pathname === '/lock-account';
  return (
    <Box sx={{ padding: '12px 0', position: 'relative', borderBottom: '1px solid #eee' }}>
      {!hideBackButton && (
        <IconButton size='small' edge='start' aria-label='back to the previous page' sx={{ position: 'absolute', left: '8px' }} onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon color='primary' />
        </IconButton>
      )}
      <Typography variant='h5' align='center' color='secondary' sx={{ fontWeight: '500', letterSpacing: '1px' }}>
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;
