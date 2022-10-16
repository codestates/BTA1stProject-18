import React from 'react';
import { createMemoryHistory } from 'history';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Welcome from './Welcome';
import CreatePassword from './CreatePassword';
import Seedphrase from './SeedPhrase';
import Dashboard from './Dashboard';
import Recover from './Recover';
import SendTokens from './Send';
import ImportAccount from './ImportAccount';
import ReserveAccountID from './ReserveAccountID';
import SeedConfirm from './SeedConfirm';
import AccountConfirm from './AccountConfirm';
import { Box } from '@mui/system';

import './App.css';
import ConfirmSeedPhrase from './ConfirmSeedPhrase';

const Router = () => {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <Box sx={{ paddingTop: '4px', marginTop: '56px', paddingX: '16px' }}>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/uc-create-password' element={<CreatePassword />} />
          <Route path='/uc-seed-phrase' element={<Seedphrase />} />
          <Route path='/uc-confirm-seed-phrase' element={<ConfirmSeedPhrase />} />
          <Route path='/reserve-account-id' element={<ReserveAccountID />} />
          <Route path='/dashboard' label='dashboard2' element={<Dashboard />} />
          <Route path='/recover' element={<Recover />} />
          <Route path='/send' element={<SendTokens />} />
          <Route path='/import-account' element={<ImportAccount />} />
          <Route path='/seed-confirm' element={<SeedConfirm />} />
          <Route path='/account-confirm' element={<AccountConfirm />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default Router;
