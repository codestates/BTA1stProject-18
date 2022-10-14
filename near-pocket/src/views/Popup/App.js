import React from "react";
import { createMemoryHistory /* , createBrowserHistory */ } from "history";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Welcome from "./Welcome";
import CreatePassword from "./CreatePassword";
import Seedphrase from "./SeedPhrase";
import Dashboard from "./Dashboard";
import Recover from "./Recover";
import SendTokens from "./Send";
import ImportAccount from "./ImportAccount";
import ReserveAccountID from "./ReserveAccountID";

import "./App.css";

function App() {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <Routes>
        <Route path="/popup.html" element={<Welcome />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/seed-phrase" element={<Seedphrase />} />
        <Route path="/reserve-account-id" element={<ReserveAccountID />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/send" element={<SendTokens />} />
        <Route path="/import-account" element={<ImportAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
