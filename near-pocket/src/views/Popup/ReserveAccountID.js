import React, { useState } from "react";
import { connect } from "near-api-js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { CONFIG } from "../../constants";
import {
  checkAccountStatus,
  getStorageSyncValue,
  setStorageSyncValue,
} from "../../utils/utilsUpdated";
import { SWITCH_ACCOUNT } from "../../redux/actionTypes";

const ReserveAccountID = () => {
  const [accountID, setAccountID] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeWallet = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.activeWallet
  );

  const createAccountID = async () => {
    try {
      setLoading(true);
      let formattedAccountID = accountID.includes(".testnet")
        ? accountID
        : accountID + ".testnet";
      const near = await connect(CONFIG);
      const accountInfo = await near.account(formattedAccountID);
      const state = await checkAccountStatus(accountInfo);
      const userInfo = await getStorageSyncValue("userInfo");
      let keys = userInfo ? Object.keys(userInfo) : null;

      let publicKey = Object.keys(userInfo[activeWallet]["accounts"])[0];

      if (state) {
        alert("Account with this name already present");
        setLoading(false);
      } else {
        await near.createAccount(formattedAccountID, publicKey);
        userInfo[activeWallet] = {
          ...userInfo[activeWallet],
          accountID: formattedAccountID,
        };

        dispatch({
          type: SWITCH_ACCOUNT,
          payload: {
            activeWallet: keys ? `wallet${keys.length}` : "wallet1",
            activeAccountID: formattedAccountID,
          },
        });
        await setStorageSyncValue("userInfo", userInfo);
        alert(`Account Created!!! Your ID is ${formattedAccountID}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("err===", error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Create Account ID</h1>
      <p>Example ID's: thisismyid.testnet, firstid.testnet</p>

      <input
        value={accountID}
        placeholder="example.testnet"
        onChange={e => setAccountID(e.target.value)}
      />
      {loading ? (
        <p>Loading!!!</p>
      ) : (
        <button onClick={createAccountID}>Create Account ID</button>
      )}
    </div>
  );
};

export default ReserveAccountID;
