import React from 'react';
import { Button, Toolbar, Typography, IconButton, AppBar } from '@mui/material';
import { Box } from '@mui/system';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LockIcon from '@mui/icons-material/Lock';
import logo from '../assets/images/near-pocket-logo-icon.svg';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import { useLocation, useNavigate } from 'react-router';

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const headerAuth = location.pathname === '/' || location.pathname.startsWith('/uc');
  const moveToDashboard = () => !headerAuth && navigate('/dashboard');

  return (
    <AppBar position='fixed' style={{ background: 'white', height: '56px' }}>
      <Toolbar>
        <Button variant='text' size='small' onClick={moveToDashboard}>
          <img src={logo} alt='near pocket logo' />
        </Button>

        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant='subtitle2' component='span' color='#7d7d7d'>
            <VpnLockIcon sx={{ width: '12px', height: '12px', mr: '4px' }} />
            test.net
          </Typography>
        </Box>

        {!headerAuth && (
          <Box>
            <IconButton size='small' edge='start' aria-label='account info' sx={{ mr: 1 }}>
              <PeopleAltIcon />
            </IconButton>
            <IconButton size='small' edge='start' aria-label='lock screen'>
              <LockIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
