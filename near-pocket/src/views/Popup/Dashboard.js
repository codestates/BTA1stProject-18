import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { fetchBalance, getStorageSyncValue, initialTasks, showAllHoldings } from '../../utils/utilsUpdated';
import { SHOW_ALL_CUSTOM_TOKENS, SWITCH_ACCOUNT } from '../../redux/actionTypes';
import { CONFIG } from '../../constants';
import { connect, utils } from 'near-api-js';
import { Box } from '@mui/system';
import { Button, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NearLogoText from '../../assets/images/near-logo-icon-text.svg';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InputIcon from '@mui/icons-material/Input';
import SendIcon from '@mui/icons-material/Send';
let near;

const dashboardHeaderStyle = {
  borderBottom: '1px solid #eee',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const transactionButtonWrapStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 32px',
};
const transactionButtonStyle = {
  width: '56px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#404040',
  borderRadius: '12px',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [curAccountID, setCurAccountID] = useState('');

  const [balance, setBalance] = useState(0);
  const [allWallets, setAllWallets] = useState([]);

  const allTokens = useSelector(({ walletEncrypted }) => walletEncrypted?.allTokens);
  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);

  const activeAccountID = useSelector(({ walletEncrypted }) => walletEncrypted?.activeAccountID);

  console.log(activeWallet);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      near = await connect(CONFIG);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { address, mnemonic, secret, accountID, allAccounts } = await initialTasks(activeWallet);
      console.log('accc', accountID);

      let userInfo = await getStorageSyncValue('userInfo');
      const account = await near.account(accountID);
      console.log(accountID);
      const availableBalance = await fetchBalance(account);
      //const allTokens = await showAllHoldings(accountID, near);
      let wallets = [];
      allAccounts.map((acc) => {
        wallets.push(userInfo[acc]);
      });
      setAllWallets(wallets);
      dispatch({
        type: SHOW_ALL_CUSTOM_TOKENS,
        payload: allTokens,
      });

      //16진수 퍼블릭 주소를 가져온다.
      const publicAddress = utils.PublicKey.fromString(address).data.toString('hex');

      setAddress(publicAddress);
      setPrivateKey(secret);
      setSeedPhrase(mnemonic);
      setBalance(availableBalance);
      setCurAccountID(accountID);
    })();
  }, [activeWallet]);

  const changeAccount = async (e) => {
    let [walletName, accId] = e.target.value.split(':');
    console.log('ACCC============================', accId);
    dispatch({
      type: SWITCH_ACCOUNT,
      payload: {
        activeWallet: walletName,
        activeAccountID: accId,
      },
    });
  };

  const copyAddress = () => navigator.clipboard.writeText(address);

  console.log('active: ', activeAccountID);
  return (
    <Box>
      {/* <h3 style={{ overflowWrap: 'break-word' }}>프라이빗키: {privateKey}</h3> */}
      {/* <h3 style={{ overflowWrap: 'break-word' }}>주소: {address}</h3> */}
      {/* <h3>시드 구문: {seedPhrase}</h3> */}
      {/* <select onChange={(e) => changeAccount(e)}>
        {allWallets.map((add, i) => (
          <option key={i} value={`${add.name}:${add.accountID}`} selected={add.accountID === activeAccountID}>
            {add.accountID}
          </option>
        ))}
      </select> */}
      <Box sx={dashboardHeaderStyle}>
        <Typography variant='subtitle2' sx={{ color: '#636363' }}>
          {curAccountID}
        </Typography>
        <Tooltip title='클립보드에 복사'>
          <Button variant='text' size='small' onClick={copyAddress}>
            <Typography variant='subtitle2' noWrap sx={{ color: '#636363', width: '100px' }}>
              {address}
            </Typography>
            <ContentCopyIcon sx={{ width: '12px', height: '12px' }} />
          </Button>
        </Tooltip>
      </Box>
      <Box mt={10} textAlign='center'>
        <img src={NearLogoText} alt='near logo' width='200px' />
        <Typography variant='h6' color='primary' sx={{ fontWeight: 'bold', marginTop: '16px' }}>
          {balance}
          <span style={{ marginLeft: '8px', color: '#565656' }}>NEAR</span>
        </Typography>
      </Box>

      <Box mt={15} sx={transactionButtonWrapStyle}>
        <Button variant='text' sx={{ display: 'block', padding: '4px' }} onClick={() => navigate('/send')}>
          <div style={transactionButtonStyle}>
            <SendIcon sx={{ color: '#fff' }} />
          </div>
          <Typography variant='subtitle1' sx={{ color: '#404040', fontWeight: 'bold' }}>
            전송
          </Typography>
        </Button>
        <Button variant='text' sx={{ display: 'block', padding: '4px' }} onClick={() => navigate('/account-confirm')}>
          <div style={transactionButtonStyle}>
            <InputIcon sx={{ color: '#fff' }} />
          </div>
          <Typography variant='subtitle1' sx={{ color: '#404040', fontWeight: 'bold' }}>
            받기
          </Typography>
        </Button>
        <Button variant='text' sx={{ display: 'block', padding: '4px' }}>
          <div style={transactionButtonStyle}>
            <ReceiptLongIcon sx={{ color: '#fff' }} />
          </div>
          <Typography variant='subtitle1' sx={{ color: '#404040', fontWeight: 'bold' }}>
            내역
          </Typography>
        </Button>
      </Box>

      {/* <h2>트랜잭션 내역</h2>
      <ul>
        {allTokens?.map((tk) => (
          <li key={tk.address}>
            {tk.name} - {tk.balance} {tk.symbol}
          </li>
        ))}
      </ul> */}
    </Box>
  );
};

export default Dashboard;
