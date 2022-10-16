import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import EntryHeader from '../../components/EntryHeader';

const PopupPage = () => {
  const navigate = useNavigate();
  const wallet = localStorage.getItem('wallet');

  useEffect(() => {
    if (wallet) {
      navigate('/dashboard');
    }
  }, []);
  const moveToPage = (route) => navigate(route);

  return (
    <Box>
      <EntryHeader />
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

export default PopupPage;
