import React from 'react';
import { createMemoryHistory } from 'history';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Welcome from './Welcome';
import CreatePassword from './CreatePassword';
import Seedphrase from './SeedPhrase';
import Dashboard from './Dashboard';
import Recover from './Recover';
import SendTokens from './SendTokens';
import ImportAccount from './ImportAccount';
import ReserveAccountID from './ReserveAccountID';
import SeedConfirm from './SeedConfirm';
import AccountConfirm from './AccountConfirm';
import LockAccount from './LockAccount';
import { Box } from '@mui/system';

import ConfirmSeedPhrase from './ConfirmSeedPhrase';
import AccountList from './AccountList';
import AppHeader from '../../components/AppHeader';

const Router = () => {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <AppHeader />
      <Box sx={{ paddingTop: '8px', marginTop: '56px', paddingX: '16px' }}>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/uc-create-password' element={<CreatePassword />} />
          <Route path='/uc-seed-phrase' element={<Seedphrase />} />
          <Route path='/uc-confirm-seed-phrase' element={<ConfirmSeedPhrase />} />
          <Route path='/uc-reserve-account-id' element={<ReserveAccountID />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/account-list' element={<AccountList />} />
          <Route path='/recover' element={<Recover />} />
          <Route path='/send' element={<SendTokens />} />
          <Route path='/import-account' element={<ImportAccount />} />
          <Route path='/seed-confirm' element={<SeedConfirm />} />
          <Route path='/account-confirm' element={<AccountConfirm />} />
          <Route path='/lock-account' element={<LockAccount />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default Router;
