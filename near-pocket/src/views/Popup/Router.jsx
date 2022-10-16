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

import './App.css';
import ConfirmSeedPhrase from './ConfirmSeedPhrase';
import AlertModal from '../../components/common/AlertModal';

const Router = () => {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <AlertModal />
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/create-password' element={<CreatePassword />} />
        <Route path='/seed-phrase' element={<Seedphrase />} />
        <Route path='/confirm-seed-phrase' element={<ConfirmSeedPhrase />} />
        <Route path='/reserve-account-id' element={<ReserveAccountID />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/recover' element={<Recover />} />
        <Route path='/send' element={<SendTokens />} />
        <Route path='/import-account' element={<ImportAccount />} />
        <Route path='/seed-confirm' element={<SeedConfirm />} />
        <Route path='/account-confirm' element={<AccountConfirm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
