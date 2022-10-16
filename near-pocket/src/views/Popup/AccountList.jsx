import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, List, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { fetchBalance, getStorageSyncValue, initialTasks } from '../../utils/utilsUpdated';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SWITCH_ACCOUNT } from '../../redux/actionTypes';
import { useNavigate } from 'react-router';

const AccountList = () => {
  const [allWallets, setAllWallets] = useState([]);

  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);
  const activeAccountID = useSelector(({ walletEncrypted }) => walletEncrypted?.activeAccountID);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 리스트 아이템 클릭시 해당 계정 대시보드로 이동
  const handleAccoutClick = (add, i) => {
    console.log(add, i);
    const walletName = add.name;
    const accountID = add.accountID;
    
    dispatch({
      type: SWITCH_ACCOUNT,
      payload: {
        activeWallet: walletName,
        activeAccountID: accountID,
      },
    });

    navigate('/dashboard');
  };

  const moveToCreate = async () => {
    navigate('/uc-seed-phrase');
  };
  const moveToImport = async () => {
    navigate('/import-account');
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
      <Typography variant='h6' align='center'>
        계정 관리
      </Typography>
      <Box>
        <List>
          {allWallets.map((add, i) => (
            <ListItemButton divider key={i} onClick={() => handleAccoutClick(add, i)}>
              <ListItemAvatar>
                <AccountCircleIcon />
              </ListItemAvatar>
              <ListItemText primary={add.name} secondary={add.accountID} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Button onClick={moveToCreate} align='center' variant='contained'>
          생성
      </Button>
      &nbsp;
      <Button onClick={moveToImport} align='center' variant='contained'>
          가져오기
      </Button>
    
    </Box>
  );
};

export default AccountList;
