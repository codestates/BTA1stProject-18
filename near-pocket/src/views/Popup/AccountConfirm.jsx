import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { initialTasks } from '../../utils/utilsUpdated';
import { useNavigate } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { utils } from 'near-api-js';
import QRCode from 'react-qr-code';
import PageHeader from '../../components/PageHeader';

const AccountConfirm = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [hexAddress, setHexAddress] = useState('');
  const activeWallet = useSelector(({ walletEncrypted }) => walletEncrypted?.activeWallet);

  useEffect(() => {
    setData();
  }, [activeWallet]);

  const copyAddress = () => navigator.clipboard.writeText(hexAddress);
  const setData = async () => {
    const { address, accountID } = await initialTasks(activeWallet);
    setAccountId(accountID);
    //16진수 퍼블릭 주소를 가져온다.
    const publicAddress = utils.PublicKey.fromString(address).data.toString('hex');
    setHexAddress(publicAddress);
  };

  return (
    <Box>
      <PageHeader title='계정 정보' />
      <Typography variant='subtitle2' fontSize={17} sx={{ color: '#636363' }} align='center' mb={2} mt={2}>
        {accountId}
      </Typography>

      <div style={{ height: 'auto', margin: '0 auto', maxWidth: 120, width: '100%' }}>
        <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={hexAddress} viewBox={`0 0 256 256`} />
      </div>
      <Typography variant='body1' mt={2} sx={{ borderRadius: '10px', wordBreak: 'break-all', display: 'flex', alignItems: 'flex-end', backgroundColor: '#bcdefc', padding: 1 }}>
        {hexAddress}
        <Tooltip title='클립보드에 복사'>
          <IconButton size='small' aria-label='copy text' onClick={copyAddress}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Typography variant='subtitle2' fontSize={12} sx={{ color: 'blue', fontWeight: '500' }} align='center' mt={2}>
        ※ 위 주소로는 니어 프로토콜 기반 자산만 받을 수 있습니다. <br />
        다른 체인 자산을 보낼 경우 자산을 찾을 수 없습니다.
      </Typography>

      <Box mt={5}>
        <Button fullWidth variant='contained' onClick={() => navigate('/dashboard')}>
          확인
        </Button>
      </Box>
    </Box>
  );
};

export default AccountConfirm;
