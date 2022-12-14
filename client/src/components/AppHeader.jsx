import React from 'react';
import { Button, Toolbar, Typography, IconButton, AppBar, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LockIcon from '@mui/icons-material/Lock';
import NearLogo from '../assets/images/near-pocket-logo-icon.svg';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useLocation, useNavigate } from 'react-router';

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const headerAuth = location.pathname === '/popup.html' || location.pathname === '/lock-account' || location.pathname.startsWith('/uc');
  const moveToDashboard = () => !headerAuth && navigate('/dashboard');

  return (
    <AppBar position='fixed' style={{ background: 'white', height: '56px' }}>
      <Toolbar>
        <Tooltip title='대시보드'>
          <Button variant='text' size='small' onClick={moveToDashboard}>
            <img src={NearLogo} alt='near pocket logo' width='100px' />
          </Button>
        </Tooltip>

        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Tooltip title='서버'>
            <Typography variant='subtitle2' component='span' color='#7d7d7d'>
              <VpnLockIcon sx={{ width: '12px', height: '12px', mr: '4px' }} />
              test.net
            </Typography>
          </Tooltip>
        </Box>

        {!headerAuth && (
          <Box>
            <Tooltip title='계정관리'>
              <IconButton size='small' edge='start' aria-label='account info' sx={{ mr: 1 }} onClick={() => navigate('/accounts-list')}>
                <PeopleAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='시드 구문 보기'>
              <IconButton size='small' edge='start' aria-label='account info' sx={{ mr: 1 }} onClick={() => navigate('/check-seed')}>
                <VpnKeyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='잠금'>
              <IconButton size='small' edge='start' aria-label='lock screen' onClick={() => navigate('/lock-account')}>
                <LockIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
