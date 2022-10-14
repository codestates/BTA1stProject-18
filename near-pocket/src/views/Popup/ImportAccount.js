import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  encryptMessage,
  getAccountIds,
  getStorageSyncValue,
  setStorageSyncValue,
} from "../../utils/utilsUpdated";
import { parseSeedPhrase } from "near-seed-phrase";
import { KeyPair } from "near-api-js";
import { SWITCH_ACCOUNT } from "../../redux/actionTypes";

const ImportAccount = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const importAccount = async () => {
    try {
      const split = phrase.split(" ");
      if (split.length === 1) {
        throw new Error("Invalid Seed Phrase");
      }
      if (!phrase) return;
      const { secretKey, seedPhrase } = parseSeedPhrase(phrase);

      const keyPair = KeyPair.fromString(secretKey);
      const publicKey = keyPair.publicKey.toString();

      const accountIdsByPublickKey = await getAccountIds(publicKey);
      if (!phrase) return;
      setLoading(true);

      let isExist = false;
      let userInfo = await getStorageSyncValue("userInfo");
      for (let info in userInfo) {
        if (userInfo[info].accountID === accountIdsByPublickKey) {
          isExist = true;
        }
      }

      if (isExist) {
        alert("Account already imported");
        setLoading(false);
        return;
      }
      let hashedPassword = await getStorageSyncValue("hashedPassword");
      const cipherPrivateKey = encryptMessage(secretKey, hashedPassword);
      const cipherPhrase = encryptMessage(seedPhrase, hashedPassword);
      let keys = userInfo ? Object.keys(userInfo) : null;
      let walletName = `wallet${keys.length + 1}`;
      userInfo = {
        ...userInfo,
        [walletName]: {
          name: walletName,
          accountID: accountIdsByPublickKey,
          accounts: {
            [publicKey]: {
              data: cipherPhrase,
              address: publicKey,
              secretKey: cipherPrivateKey,
            },
          },
        },
      };

      dispatch({
        type: SWITCH_ACCOUNT,
        payload: {
          activeWallet: keys ? `wallet${keys.length + 1}` : "wallet1",
          activeAccountID: accountIdsByPublickKey,
        },
      });

      await setStorageSyncValue("userInfo", userInfo);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.log("err===", error.message);
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>Import Account from Seed Phrase</h3>
      <input value={phrase} onChange={e => setPhrase(e.target.value)} />
      {loading ? (
        <p>Loading!!!</p>
      ) : (
        <button onClick={importAccount}>Import</button>
      )}
      <button style={{ marginTop: 10 }} onClick={() => navigate("/dashboard")}>
        {" "}
        {"<"} Go Back
      </button>
    </div>
  );
};

export default ImportAccount;
