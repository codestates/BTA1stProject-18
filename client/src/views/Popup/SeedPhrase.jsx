import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { encryptMessage, generateSeed, getStorageSyncValue } from '../../utils/utilsUpdated';
import { useNavigate } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PageHeader from '../../components/PageHeader';
import useAlert from '../../hooks/useAlert';

const Seedphrase = () => {
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const [mnemonics, setMnemonics] = useState('');
  const [encryptedData, setEncryptedData] = useState(null);

  useEffect(() => {
    setMnemonicPhrase();
  }, []);

  const copyMnemonics = () => {
    setAlert('info', '시드구문이 클립보드에 복사되었습니다.');
    navigator.clipboard.writeText(mnemonics);
  };
  const setMnemonicPhrase = async () => {
    const { phrase, address, secret } = generateSeed();
    setMnemonics(phrase);
    const hashedPassword = await getStorageSyncValue('hashedPassword');
    const storedUserDetails = await getStorageSyncValue('userInfo');
    const cipherMnemonic = encryptMessage(phrase, hashedPassword);
    const cipherPrivate = encryptMessage(secret, hashedPassword);
    setEncryptedData({ data: cipherMnemonic, address: address, secretKey: cipherPrivate });
    console.log(storedUserDetails);
  };

  const moveToConfirmSeedPhrase = async () => {
    navigate('/uc-confirm-seed-phrase', { state: { ...encryptedData } });
  };

  return (
    <Box>
      <PageHeader title='시드구문 보관안내' />
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='left' mt={2}>
        아래 시드 구문을 종이에 적어 안전하게 보관해주세요.
        <br />
        이메일이나 컴퓨터에 보관할 경우 해킹으로 시드 구문이 유출될 수 있으니 삼가해주세요
      </Typography>
      <Typography variant='body1' align='left' mt={2} sx={{ borderRadius: '10px', display: 'flex', alignItems: 'flex-end', backgroundColor: '#bcdefc', padding: 1 }}>
        {mnemonics}
        <Tooltip title='클립보드에 복사'>
          <IconButton size='small' aria-label='copy text' onClick={copyMnemonics}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Box mt={5}>
        <Button onClick={moveToConfirmSeedPhrase} fullWidth variant='contained'>
          안전한 곳에 보관했습니다.
        </Button>
      </Box>
    </Box>
  );
};

export default Seedphrase;
