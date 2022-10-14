import React from 'react';
import { Box } from '@mui/system';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  const moveToSignPage = () => navigate('/sign');

  return (
    <Box>
      <Typography variant='h3' fontWeight='bold'>
        홈
      </Typography>
      <Box>
        <Button onClick={moveToSignPage}>eeee</Button>
      </Box>
    </Box>
  );
};

export default Home;
