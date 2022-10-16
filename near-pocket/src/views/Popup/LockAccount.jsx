import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl, Typography } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAlert from '../../hooks/useAlert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { encryptMessage, getAccountIds, getStorageSyncValue, setStorageSyncValue } from '../../utils/utilsUpdated';

import PageHeader from '../../components/PageHeader';

const LockAccount = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setAlert } = useAlert();
  const navigate = useNavigate();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const unlockAccount = async () => {
    try {
      
      if (!password) {
        setAlert('error', '비밀번호를 입력해주세요.');
        //alert("패스워드를 입력해주세요.");
        return;
      }
      setLoading(true);
      
      //패스워드 비교
      const savedPassword = await getStorageSyncValue('hashedPassword', true);
      console.log(savedPassword)
      if(savedPassword !== password) {
        setAlert('error', '비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      localStorage.setItem('wallet', true);
      navigate('/dashboard');

    } catch (error) {
      console.log('err===', error.message);
      setLoading(false);
      setAlert('error', error.message);
      //alert(error.message);
    }
  };

  return (
    <Box>
      <PageHeader title='계정 잠금' />
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='center' mt={2}>
        NEAR Pocket 계정 잠금을 해제하려면 <br/> 비밀번호를 입력해주세요.
      </Typography>

      <Box component='form' noValidate autoComplete='off' mt={5}>
        <FormControl fullWidth variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>비밀번호를 입력하세요.</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={handleShowPassword} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
        </Box>

      {/* {mnemonicError && (
        <Typography variant='subtitle2' align='left' sx={{ color: 'red' }} mt={2} mb={2}>
          비밀번호가 올바르지 않습니다..
        </Typography>
      )} */}
      <Box mt={5}>
        <Button onClick={unlockAccount} fullWidth variant='contained' disabled={!password}>
          잠금 해제
        </Button>
        
      </Box>
      {loading && <LoadingSpinner />}
    </Box>
  );
};

export default LockAccount;
