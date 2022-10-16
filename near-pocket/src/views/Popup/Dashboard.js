import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchBalance,
  getStorageSyncValue,
  initialTasks,
  showAllHoldings,
} from "../../utils/utilsUpdated";
import {
  SHOW_ALL_CUSTOM_TOKENS,
  SWITCH_ACCOUNT,
} from "../../redux/actionTypes";
import { CONFIG } from "../../constants";
import { connect, utils } from "near-api-js";

let near;

const Dashboard = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");

  const [balance, setBalance] = useState(0);
  const [allWallets, setAllWallets] = useState([]);

  const allTokens = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.allTokens
  );
  const activeWallet = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.activeWallet
  );

  const activeAccountID = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.activeAccountID
  );

  console.log(activeWallet);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      near = await connect(CONFIG);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { address, mnemonic, secret, accountID, allAccounts } =
        await initialTasks(activeWallet);
      console.log("accc", accountID);

      let userInfo = await getStorageSyncValue("userInfo");
      const account = await near.account(accountID);
      console.log(account)
      const availableBalance = await fetchBalance(account);
      //const allTokens = await showAllHoldings(accountID, near);
      let wallets = [];
      allAccounts.map(acc => {
        wallets.push(userInfo[acc]);
      });
      setAllWallets(wallets);
      dispatch({
        type: SHOW_ALL_CUSTOM_TOKENS,
        payload: allTokens,
      });

      //16진수 퍼블릭 주소를 가져온다.
      const publicAddress = utils.PublicKey.fromString(address).data.toString('hex');

      setAddress(publicAddress);
      setPrivateKey(secret);
      setSeedPhrase(mnemonic);
      setBalance(availableBalance);
    })();
  }, [activeWallet]);

  const changeAccount = async e => {
    let [walletName, accId] = e.target.value.split(":");
    console.log("ACCC============================", accId);
    dispatch({
      type: SWITCH_ACCOUNT,
      payload: {
        activeWallet: walletName,
        activeAccountID: accId,
      },
    });
  };

  console.log("active: ", activeAccountID);
  return (
    <>
      <h3 style={{ overflowWrap: "break-word" }}>프라이빗키: {privateKey}</h3>
      <h3 style={{ overflowWrap: "break-word" }}>주소: {address}</h3>
      <h3>시드 구문: {seedPhrase}</h3>

      <select onChange={e => changeAccount(e)}>
        {allWallets.map((add, i) => (
          <option
            key={i}
            value={`${add.name}:${add.accountID}`}
            selected={add.accountID === activeAccountID}
          >
            {add.accountID}
          </option>
        ))}
      </select>

      <h4>Balance: {balance} NEAR</h4>
      <Link to="/send">
        <button>전송</button>
      </Link>

      <Link to="/seed-phrase">
        <button>계정 생성</button>
      </Link>

      <Link to="/import-account">
        <button>계정 가져오기</button>
      </Link>

      <h2>트랜잭션 내역</h2>
      <ul>
        {allTokens?.map(tk => (
          <li key={tk.address}>
            {tk.name} - {tk.balance} {tk.symbol}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dashboard;
