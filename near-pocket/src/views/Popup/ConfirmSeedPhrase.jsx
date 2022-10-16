import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';
import { decryptMessage, getStorageSyncValue, setStorageSyncValue } from '../../utils/utilsUpdated';
import { CREATE_WALLET, SET_CURRENT_WALLET_NAME, SWITCH_ACCOUNT } from '../../redux/actionTypes';
import EntryHeader from '../../components/EntryHeader';

const ConfirmSeedPhrase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmMnemonics, setConfirmMnemonics] = useState('');
  const [mnemonicError, setMnemonicError] = useState(false);
  const dispatch = useDispatch();

  const handleTypeConfirmMnemonics = (e) => {
    setMnemonicError(false);
    setConfirmMnemonics(e.target.value);
  };

  const storeUserInfo = async () => {
    const hashedPassword = await getStorageSyncValue('hashedPassword');
    const storedUserDetails = await getStorageSyncValue('userInfo');
    const encryptedData = { ...location?.state };
    let keys = storedUserDetails ? Object.keys(storedUserDetails) : null;

    console.log(`router: ${encryptedData.data}`);
    console.log(`decrypted: ${decryptMessage(encryptedData.data, hashedPassword)}`);

    if (decryptMessage(encryptedData.data, hashedPassword) === confirmMnemonics) {
      let userInfo;

      if (!storedUserDetails) {
        userInfo = {
          wallet1: {
            name: 'wallet1',
            accounts: {
              [encryptedData.address]: {
                data: encryptedData.data,
                address: encryptedData.address,
                secretKey: encryptedData.secretKey,
              },
            },
          },
        };
      } else {
        let walletName = `wallet${keys.length + 1}`;
        userInfo = {
          ...storedUserDetails,
          [walletName]: {
            name: walletName,
            accounts: {
              [encryptedData.address]: {
                data: encryptedData.data,
                address: encryptedData.address,
                secretKey: encryptedData.secretKey,
              },
            },
          },
        };
      }

      dispatch({
        type: CREATE_WALLET,
        payload: {
          isLoggedIn: true,
        },
      });
      dispatch({
        type: SWITCH_ACCOUNT,
        payload: {
          activeWallet: keys ? `wallet${keys.length + 1}` : 'wallet1',
          activeAccountID: '',
        },
      });

      localStorage.setItem('wallet', true);
      dispatch({ type: SET_CURRENT_WALLET_NAME, payload: 'wallet1' });
      await setStorageSyncValue('userInfo', userInfo);
      navigate('/reserve-account-id');
    } else {
      setMnemonicError(true);
    }
  };

  return (
    <Box>
      <EntryHeader />
      <Typography variant='h6' align='left'>
        시드 구문 확인
      </Typography>
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='left' mt={2}>
        받았던 시드 구문을 입력해주세요.
      </Typography>
      <Box mt={5}>
        <TextField label='시드 구문 확인' fullWidth variant='outlined' onChange={handleTypeConfirmMnemonics} />
      </Box>
      {mnemonicError && (
        <Typography variant='subtitle2' align='left' sx={{ color: 'red' }} mt={2} mb={2}>
          시드 구문이 일치하지 않습니다.
        </Typography>
      )}
      <Box mt={5}>
        <Button onClick={storeUserInfo} fullWidth variant='contained' disabled={mnemonicError || !confirmMnemonics}>
          시드 구문 확인
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmSeedPhrase;
