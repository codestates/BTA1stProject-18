import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, TextField, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl, Typography } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAlert from '../../hooks/useAlert';

import { encryptMessage, getAccountIds, getStorageSyncValue, setStorageSyncValue } from '../../utils/utilsUpdated';
import { parseSeedPhrase } from 'near-seed-phrase';
import { KeyPair } from 'near-api-js';
import { useDispatch } from 'react-redux';
import { CREATE_WALLET, IMPORT_WALLET, SET_CURRENT_WALLET_NAME, SWITCH_ACCOUNT } from '../../redux/actionTypes';
import PageHeader from '../../components/PageHeader';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Recover = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTypeConfirmMnemonics = (e) => {
    //setMnemonicError(false);
    setPhrase(e.target.value);
  };
  const handleTypeConfirmPassword = (e) => {
    //setMnemonicError(false);
    setPassword(e.target.value);
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const recoverAccount = async () => {
    try {
      const split = phrase.split(' ');
      if (split.length === 1) {
        throw new Error('유효하지 않은 시드 문구입니다.');
      }
      if (!phrase) return;
      if (!password) {
        setAlert('error', '패스워드를 입력해주세요.');
        //alert("패스워드를 입력해주세요.");
        return;
      }
      setLoading(true);
      const { secretKey, seedPhrase } = parseSeedPhrase(phrase);

      const keyPair = KeyPair.fromString(secretKey);
      const publicKey = keyPair.publicKey.toString();

      const accountIdsByPublickKey = await getAccountIds(publicKey);
      console.log(accountIdsByPublickKey);

      const cipherPrivateKey = encryptMessage(secretKey, password);
      const cipherPhrase = encryptMessage(seedPhrase, password);

      let userInfo = {
        wallet1: {
          name: 'wallet1',
          accountID: accountIdsByPublickKey,
          //accountIdsByPublickKey.length > 0 && accountIdsByPublickKey[0],
          accounts: {
            [publicKey]: {
              data: cipherPhrase,
              address: publicKey,
              secretKey: cipherPrivateKey,
            },
          },
        },
      };

      dispatch({
        type: SWITCH_ACCOUNT,
        payload: {
          activeWallet: 'wallet1',
          activeAccountID: accountIdsByPublickKey,
        },
      });

      dispatch({
        type: IMPORT_WALLET,
        payload: {
          walletImported: true,
        },
      });
      dispatch({
        type: CREATE_WALLET,
        payload: {
          isLoggedIn: true,
        },
      });
      dispatch({
        type: SET_CURRENT_WALLET_NAME,
        payload: 'wallet1',
      });

      await setStorageSyncValue('userInfo', userInfo);
      await setStorageSyncValue('hashedPassword', password);
      await setStorageSyncValue('accounts', 0);
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
      <PageHeader title='계정 복구' />
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='center' mt={2}>
        시드 구문과 비밀번호를 입력해주세요.
      </Typography>
      <Box mt={5}>
        <TextField label='시드 구문을 입력하세요.' fullWidth variant='outlined' onChange={handleTypeConfirmMnemonics} />
      </Box>

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
          시드 구문이 일치하지 않습니다.
        </Typography>
      )} */}
      <Box mt={5}>
        <Button onClick={recoverAccount} fullWidth variant='contained' disabled={!password || !phrase}>
          복구
        </Button>
      </Box>
      {loading && <LoadingSpinner />}
    </Box>
  );
};

export default Recover;
