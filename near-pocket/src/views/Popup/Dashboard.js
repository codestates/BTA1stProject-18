import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { fetchBalance, getStorageSyncValue, initialTasks, showAllHoldings } from '../../utils/utilsUpdated';
import { SHOW_ALL_CUSTOM_TOKENS, SWITCH_ACCOUNT } from '../../redux/actionTypes';
import { CONFIG } from '../../constants';
import { connect, utils } from 'near-api-js';
import { Box } from '@mui/system';
import { Modal, Backdrop, Fade, Typography } from '@mui/material';

let near;

const modalStyle = {
  position: 'absolute',
  top: '64px',
  bottom: '64px',
  left: '16px',
  right: '16px',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const [balance, setBalance] = useState(0);
  const [allWallets, setAllWallets] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
      console.log(account);
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

  console.log('active: ', activeAccountID);
  return (
    <Box>
      <h3 style={{ overflowWrap: 'break-word' }}>프라이빗키: {privateKey}</h3>
      <h3 style={{ overflowWrap: 'break-word' }}>주소: {address}</h3>
      <h3>시드 구문: {seedPhrase}</h3>

      <select onChange={(e) => changeAccount(e)}>
        {allWallets.map((add, i) => (
          <option key={i} value={`${add.name}:${add.accountID}`} selected={add.accountID === activeAccountID}>
            {add.accountID}
          </option>
        ))}
      </select>

      <h4>Balance: {balance} NEAR</h4>
      <Link to='/send'>
        <button>전송</button>
      </Link>

      <Link to='/uc-seed-phrase'>
        <button>계정 생성</button>
      </Link>

      <Link to='/import-account'>
        <button>계정 가져오기</button>
      </Link>

      <h2>트랜잭션 내역</h2>
      <ul>
        {allTokens?.map((tk) => (
          <li key={tk.address}>
            {tk.name} - {tk.balance} {tk.symbol}
          </li>
        ))}
      </ul>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={modalStyle}>
            <Typography id='transition-modal-title' variant='h6' component='h2'>
              Text in a modal
            </Typography>
            <Typography id='transition-modal-description' sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Dashboard;
