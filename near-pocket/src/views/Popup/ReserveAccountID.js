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
        alert("이미 동일한 계정 ID가 있습니다.");
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
        alert(`계정이 생성되었습니다!!! ID는 ${formattedAccountID}`);
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
      <h1>계정 ID 생성</h1>
      <p>예시 ID's: thisismyid.testnet, firstid.testnet</p>

      <input
        value={accountID}
        placeholder="example.testnet"
        onChange={e => setAccountID(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={createAccountID}>계정 생성</button>
      )}
    </div>
  );
};

export default ReserveAccountID;
