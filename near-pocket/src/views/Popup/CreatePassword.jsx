import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setStorageSyncValue } from '../../utils/utilsUpdated';
import PageHeader from '../../components/PageHeader';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const createPassword = async () => {
    await setStorageSyncValue('hashedPassword', password);
    navigate('/uc-seed-phrase');
  };

  return (
    <Box>
      <PageHeader title='비밀번호 설정' />
      <Typography variant='subtitle1' align='left' mt={2} mb={2}>
        계정에 접근하기 위해 사용될 고유한 비밀번호를 설정하세요.
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
        <FormControl fullWidth sx={{ marginTop: 2 }} variant='outlined' mt={5}>
          <InputLabel htmlFor='outlined-adornment-password'>비밀번호 확인</InputLabel>
          <OutlinedInput
            id='outlined-adornment-confirm-password'
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={handleShowConfirmPassword} edge='end'>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='비밀번호 확인'
          />
        </FormControl>
        {password && confirmPassword && password !== confirmPassword && (
          <Typography variant='subtitle2' align='left' sx={{ color: 'red' }} mt={2} mb={2}>
            비밀번호가 일치하지 않습니다.
          </Typography>
        )}

        <Box mt={5}>
          <Button onClick={createPassword} fullWidth variant='contained' disabled={!password || !confirmPassword || password !== confirmPassword}>
            생성
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePassword;
