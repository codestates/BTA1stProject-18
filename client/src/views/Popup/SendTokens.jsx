import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, InputAdornment, OutlinedInput } from '@mui/material';
import { CONFIG } from '../../constants';
import { connect, KeyPair, keyStores, transactions } from 'near-api-js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { BN } from 'bn.js';
import { initialTasks } from '../../utils/utilsUpdated';
import { Box } from '@mui/system';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { utils } from 'near-api-js';
import useAlert from '../../hooks/useAlert';

// const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');
// const FT_TRANSFER_DEPOSIT = '1';

const flexBoxStyle = {
  display: 'flex',
  alignItems: 'center',
};

const SendTokens = () => {
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [accountID, setAccountID] = useState(null);
  const [hexAddress, setHexAddress] = useState(null);
  const [secret, setSecret] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState(0);
  // const [selectedAsset, setSelectedAsset] = useState('');
  // const allTokens = useSelector(({ walletEncrypted }) => walletEncrypted?.allTokens);
  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);

  useEffect(() => {
    setData();
  }, [activeWallet]);

  const setData = async () => {
    const { secret, address, accountID } = await initialTasks(activeWallet);
    setAccountID(accountID);
    setSecret(secret);
    const publicAddress = utils.PublicKey.fromString(address).data.toString('hex');
    setHexAddress(publicAddress);
  };

  const sendTransaction = async () => {
    setLoading(true);
    try {
      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(secret);
      await keyStore.setKey('testnet', accountID, keyPair);

      const near = await connect({ ...CONFIG, keyStore });
      const senderAccount = await near.account(accountID);

      const yoctoAmount = parseNearAmount(amount);
      const convertedAmount = new BN(yoctoAmount);

      // if (selectedAsset !== '') {
      //   let [contractAddress, decimals] = selectedAsset.split(':');
      //   console.log('OTHER SSETS TRANSFER', contractAddress, receiver);
      //   let transfer = await senderAccount.functionCall(
      //     contractAddress,
      //     'ft_transfer',
      //     {
      //       amount: (amount * 10 ** decimals).toString(),
      //       receiver_id: receiver,
      //     },
      //     FT_TRANSFER_GAS,
      //     FT_TRANSFER_DEPOSIT
      //   );
      //   console.log('HASH========', transfer);
      // } else {
      //   console.log('NEAR TRANSFER');
      //   const transaction = await senderAccount.sendMoney(receiver, convertedAmount);
      //   console.log('HASH========', transaction.transaction.hash);
      // }
      const transaction = await senderAccount.sendMoney(`${receiver}.testnet`, convertedAmount);
      console.log('HASH========', transaction.transaction.hash);
      setAlert('success', '성공적으로 송금되었습니다.');
      navigate('/dashboard');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.message.includes('no matching key pair found in InMemorySigner')) {
        setAlert('error', '해당 계정은 송금에 대한 권한이 없습니다.');
      } else {
        setAlert('error', error.message);
      }
    }
  };

  return (
    <Box>
      <PageHeader title='NEAR 전송' />
      <Typography variant='subtitle2' sx={{ color: '#636363' }} mt={2}>
        받는 계정 ID와 전송할 NEAR 갯수를 입력하세요.
      </Typography>
      <Box mt={2} sx={{ padding: '12px', borderRadius: '12px', backgroundColor: '#5f8afa21' }}>
        <Typography variant='h6'>보내는 계정</Typography>
        <Box sx={flexBoxStyle} mt={2}>
          <Typography variant='subtitle2' sx={{ color: '#636363', width: '60px' }}>
            계정 ID:
          </Typography>
          <Typography variant='subtitle2' noWrap sx={{ width: '200px' }}>
            {accountID}
          </Typography>
        </Box>
        <Box sx={flexBoxStyle} mt={1}>
          <Typography variant='subtitle2' sx={{ color: '#636363', width: '60px' }}>
            주소:
          </Typography>
          <Typography variant='subtitle2' noWrap sx={{ width: '200px' }}>
            {hexAddress}
          </Typography>
        </Box>
      </Box>
      <Box mt={3} sx={{ padding: '12px', borderRadius: '12px', border: '2px solid #b7b7b7' }}>
        <Typography variant='h6'>받는 계정</Typography>
        <Box sx={flexBoxStyle} mt={2}>
          <Typography variant='subtitle2' sx={{ color: '#636363', width: '60px' }}>
            계정 ID:
          </Typography>
          <OutlinedInput sx={{ height: '36px' }} endAdornment={<InputAdornment position='end'>.testnet</InputAdornment>} onChange={(e) => setReceiver(e.target.value)} />
        </Box>
        <Box sx={flexBoxStyle} mt={1}>
          <Typography variant='subtitle2' sx={{ color: '#636363', width: '60px' }}>
            수량:
          </Typography>
          <OutlinedInput sx={{ height: '36px' }} endAdornment={<InputAdornment position='end'>NEAR</InputAdornment>} onChange={(e) => setAmount(e.target.value)} />
        </Box>
      </Box>
      <Box mt={5}>
        <Button onClick={sendTransaction} fullWidth variant='contained' disabled={!accountID || !amount}>
          전송
        </Button>
      </Box>
      {loading && <LoadingSpinner />}
    </Box>
  );
};

export default SendTokens;
