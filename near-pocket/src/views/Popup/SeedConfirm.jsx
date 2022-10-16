import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

import Box from '@mui/material/Box';
import { Button, IconButton, Typography } from '@mui/material';
import { initialTasks } from '../../utils/utilsUpdated';
import { useNavigate } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EntryHeader from '../../components/EntryHeader';

const SeedConfirm = () => {
  const navigate = useNavigate();
  const [mnemonics, setMnemonics] = useState('');
  
  const activeWallet = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.activeWallet
  );

  useEffect(() => {
    setMnemonicPhrase();
  }, [activeWallet]);

  const copyMnemonics = () => navigator.clipboard.writeText(mnemonics);
  
  const setMnemonicPhrase = async () => {

    const { mnemonic } =
    await initialTasks(activeWallet);
    
    setMnemonics(mnemonic);
  };

  const moveToDashboard = async () => {
    navigate('/dashboard');
  };

  return (
    <Box>
      <EntryHeader />
      <Typography variant='h6' align='center'>
        시드 구문 보기
      </Typography>
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='center' mt={2}>
        비밀번호를 분실하거나 니어 포켓 재설치 시, 
        <br />
        시드 구문으로 기존 계정을 복구할 수 있습니다.
        <br />
        시드 구문을 안전한 곳에 보관해주세요.
      </Typography>
      <Typography variant='body1' align='left' mt={2} sx={{ display: 'flex', alignItems: 'flex-end', backgroundColor: '#bcdefc', padding: 1 }}>
        {mnemonics}
        <IconButton size='small' aria-label='copy text' onClick={copyMnemonics}>
          <ContentCopyIcon />
        </IconButton>
      </Typography>
      <Box mt={5}>
        <Button onClick={moveToDashboard} fullWidth variant='contained'>
          확인
        </Button>
      </Box>
    </Box>
  );
};

export default SeedConfirm;
