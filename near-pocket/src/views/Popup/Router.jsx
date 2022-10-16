import React from 'react';
import { createMemoryHistory } from 'history';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';

import CreatePassword from './CreatePassword';
import StartPage from './StartPage';
import Seedphrase from './SeedPhrase';
import Dashboard from './Dashboard';
import RecoverAccount from './RecoverAccount';
import SendTokens from './SendTokens';
import ImportAccount from './ImportAccount';
import CreateAccountID from './CreateAccountID';
import CheckSeedPhrase from './CheckSeedPhrase';
import AccountConfirm from './AccountConfirm';
import LockAccount from './LockAccount';
import { Box } from '@mui/system';

import ConfirmSeedPhrase from './ConfirmSeedPhrase';
import AccountsList from './AccountsList';
import AppHeader from '../../components/AppHeader';

const Router = () => {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <AppHeader />
      <Box sx={{ paddingTop: '8px', marginTop: '56px', paddingX: '16px' }}>
        <Routes>
          <Route path='/' element={<Navigate to='/popup.html' replace />} />
          <Route path='/popup.html' element={<StartPage />} />
          <Route path='/uc-create-password' element={<CreatePassword />} />
          <Route path='/uc-seed-phrase' element={<Seedphrase />} />
          <Route path='/uc-confirm-seed-phrase' element={<ConfirmSeedPhrase />} />
          <Route path='/uc-create-account' element={<RecoverAccount />} />
          <Route path='/uc-reserve-account-id' element={<CreateAccountID />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/accounts-list' element={<AccountsList />} />
          <Route path='/send' element={<SendTokens />} />
          <Route path='/import-account' element={<ImportAccount />} />
          <Route path='/check-seed' element={<CheckSeedPhrase />} />
          <Route path='/account-confirm' element={<AccountConfirm />} />
          <Route path='/lock-account' element={<LockAccount />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default Router;
