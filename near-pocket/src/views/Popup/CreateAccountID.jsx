import React, { useState } from 'react';
import { connect } from 'near-api-js';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';
import { CONFIG } from '../../constants';
import { checkAccountStatus, getStorageSyncValue, setStorageSyncValue } from '../../utils/utilsUpdated';
import { SWITCH_ACCOUNT } from '../../redux/actionTypes';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAlert from '../../hooks/useAlert';
import PageHeader from '../../components/PageHeader';

const ReserveAccountID = () => {
  const [accountID, setAccountID] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);
  const handleIdInput = (e) => {
    setErrorMsg('');
    setAccountID(e.target.value);
  };
  const createAccountID = async () => {
    try {
      setLoading(true);
      let formattedAccountID = accountID.includes('.testnet') ? accountID : accountID + '.testnet';
      const near = await connect(CONFIG);
      const accountInfo = await near.account(formattedAccountID);
      const state = await checkAccountStatus(accountInfo);
      const userInfo = await getStorageSyncValue('userInfo');
      let keys = userInfo ? Object.keys(userInfo) : null;

      let publicKey = Object.keys(userInfo[activeWallet]['accounts'])[0];

      if (state) {
        setErrorMsg('이미 동일한 계정 ID가 있습니다.');
        setLoading(false);
      } else {
        await near.createAccount(formattedAccountID, publicKey);
        userInfo[activeWallet] = {
          ...userInfo[activeWallet],
          accountID: formattedAccountID,
        };

        dispatch({
          type: SWITCH_ACCOUNT,
          payload: {
            activeWallet: keys ? `wallet${keys.length}` : 'wallet1',
            activeAccountID: formattedAccountID,
          },
        });
        await setStorageSyncValue('userInfo', userInfo);
        setAlert('success', `${formattedAccountID} 계정이 생성되었습니다.`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('err===', error);
      setAlert('error', error.message);
      // alert(error.message);
    }
    setLoading(false);
  };

  return (
    <Box>
      <PageHeader title='계정 ID 생성' />
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='left' mt={2}>
        ID 생성시 ".testnet"이 자동으로 붙어서 생성됩니다.
      </Typography>
      <Box mt={5} sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField label='계정 ID' fullWidth variant='standard' onChange={handleIdInput} />
        <Typography variant='subtitle2'>.testnet</Typography>
      </Box>
      {errorMsg && (
        <Typography variant='subtitle2' align='left' sx={{ color: 'red' }} mt={2} mb={2}>
          {errorMsg}
        </Typography>
      )}
      <Box mt={5}>
        <Button onClick={createAccountID} fullWidth variant='contained' disabled={!accountID || errorMsg}>
          계정 ID생성
        </Button>
      </Box>
      {loading && <LoadingSpinner />}
    </Box>
  );
};

export default ReserveAccountID;
