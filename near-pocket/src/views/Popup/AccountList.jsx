import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { List, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { fetchBalance, getStorageSyncValue, initialTasks, showAllHoldings } from '../../utils/utilsUpdated';
import { useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AccountList = () => {
  const [allWallets, setAllWallets] = useState([]);

  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);
  // 리스트 아이템 클릭시
  const handleAccoutClick = (add, i) => {
    console.log(add, i);
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
      <Typography variant='h6' align='left'>
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
    </Box>
  );
};

export default AccountList;
