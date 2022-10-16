import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, List, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { fetchBalance, getStorageSyncValue, initialTasks } from '../../utils/utilsUpdated';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SWITCH_ACCOUNT } from '../../redux/actionTypes';
import { useNavigate } from 'react-router';
import PageHeader from '../../components/PageHeader';
import useAlert from '../../hooks/useAlert';

const AccountList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setAlert } = useAlert();
  const [allWallets, setAllWallets] = useState([]);

  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);
  const activeAccountID = useSelector(({ walletEncrypted }) => walletEncrypted?.activeAccountID);

  // 리스트 아이템 클릭시 해당 계정 대시보드로 이동
  const handleAccoutClick = (account) => {
    const walletName = account.name;
    const accountID = account.accountID;
    dispatch({
      type: SWITCH_ACCOUNT,
      payload: {
        activeWallet: walletName,
        activeAccountID: accountID,
      },
    });
    setAlert('info', `${accountID}계정으로 전환되었습니다.`);
    navigate('/dashboard');
  };

  useEffect(() => {
    (async () => {
      const { address, mnemonic, secret, accountID, allAccounts } = await initialTasks(activeWallet);
      let userInfo = await getStorageSyncValue('userInfo');
      let wallets = [];
      allAccounts.map((acc) => {
        wallets.push(userInfo[acc]);
      });
      setAllWallets(wallets);
    })();
  }, [activeWallet]);
  return (
    <Box>
      <PageHeader title='계정 관리' />
      <Box sx={{ height: '380px', overflowY: 'auto' }}>
        <List>
          {allWallets.map((account, i) => (
            <ListItemButton divider key={i} onClick={() => handleAccoutClick(account)}>
              <ListItemAvatar>
                <AccountCircleIcon />
              </ListItemAvatar>
              <ListItemText primary={account.name} secondary={account.accountID} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <Button variant='contained' sx={{ width: '150px' }} onClick={() => navigate('/uc-seed-phrase')}>
          생성
        </Button>
        <Button variant='outlined' sx={{ width: '150px' }} onClick={() => navigate('/import-account')}>
          가져오기
        </Button>
      </Box>
    </Box>
  );
};

export default AccountList;
