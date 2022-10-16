import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl, Typography } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAlert from '../../hooks/useAlert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { encryptMessage, getAccountIds, getStorageSyncValue, setStorageSyncValue } from '../../utils/utilsUpdated';

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
        return;
      }
      setLoading(true);
      //패스워드 비교
      const savedPassword = await getStorageSyncValue('hashedPassword', true);
      if (savedPassword !== password) {
        setAlert('error', '비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }
      localStorage.setItem('wallet', true);
      setAlert('success', '다시 오신것을 환영합니다.');
      navigate('/dashboard');
    } catch (error) {
      console.log('err===', error.message);
      setLoading(false);
      setAlert('error', error.message);
    }
  };

  return (
    <Box>
      <Typography variant='h4' align='left' mt={5} mb={5} sx={{ fontWeight: 500 }} color='secondary'>
        NEAR Pocket이 <br /> 잠긴 상태입니다.
      </Typography>
      <Typography variant='subtitle2' sx={{ color: '#636363' }} mt={2}>
        NEAR Pocket 계정 잠금을 해제하려면 <br /> 비밀번호를 입력해주세요.
      </Typography>

      <Box component='form' noValidate autoComplete='off' mt={5}>
        <FormControl fullWidth variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>비밀번호</InputLabel>
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
            label='비밀번호'
          />
        </FormControl>
      </Box>
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
