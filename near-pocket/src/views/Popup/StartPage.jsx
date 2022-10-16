import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';

const StartPage = () => {
  const navigate = useNavigate();
  const wallet = localStorage.getItem('wallet');

  useEffect(() => {
    if (wallet) {
      navigate('/lock-account');
    }
  }, []);
  const moveToPage = (route) => navigate(route);

  return (
    <Box>
      <Typography variant='h4' align='center' mt={5} mb={5}>
        Welcome to NEAR Pocket
      </Typography>
      <Box mt={10}>
        <Box>
          <Button onClick={() => moveToPage('/uc-create-password')} fullWidth variant='outlined'>
            계정 생성
          </Button>
        </Box>
        <Box mt={3}>
          <Button onClick={() => moveToPage('/recover')} fullWidth variant='outlined'>
            계정 복구
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StartPage;
