import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  encryptMessage,
  getAccountIds,
  getStorageSyncValue,
  setStorageSyncValue,
} from "../../utils/utilsUpdated";
import { parseSeedPhrase } from "near-seed-phrase";
import { KeyPair } from "near-api-js";
import { useDispatch } from "react-redux";
import {
  CREATE_WALLET,
  IMPORT_WALLET,
  SET_CURRENT_WALLET_NAME,
  SWITCH_ACCOUNT,
} from "../../redux/actionTypes";

const ImportAccount = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const recoverAccount = async () => {
    try {
      const split = phrase.split(" ");
      if (split.length === 1) {
        throw new Error("유효하지 않은 시드 문구입니다.");
      }
      if (!phrase) return;
      if (!password) {
        alert("패스워드를 입력해주세요.");
        return;
      }
      setLoading(true);
      const { secretKey, seedPhrase } = parseSeedPhrase(phrase);

      const keyPair = KeyPair.fromString(secretKey);
      const publicKey = keyPair.publicKey.toString();

      const accountIdsByPublickKey = await getAccountIds(publicKey);
      console.log(accountIdsByPublickKey);
      
      const cipherPrivateKey = encryptMessage(secretKey, password);
      const cipherPhrase = encryptMessage(seedPhrase, password);

      let userInfo = {
        wallet1: {
          name: "wallet1",
          accountID:
            accountIdsByPublickKey,
            //accountIdsByPublickKey.length > 0 && accountIdsByPublickKey[0],
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
          activeWallet: "wallet1",
          activeAccountID: accountIdsByPublickKey,
        },
      });

      dispatch({
        type: IMPORT_WALLET,
        payload: {
          walletImported: true,
        },
      });
      dispatch({
        type: CREATE_WALLET,
        payload: {
          isLoggedIn: true,
        },
      });
      dispatch({
        type: SET_CURRENT_WALLET_NAME,
        payload: "wallet1",
      });

      await setStorageSyncValue("userInfo", userInfo);
      await setStorageSyncValue("hashedPassword", password);
      await setStorageSyncValue("accounts", 0);
      localStorage.setItem("wallet", true);
      navigate("/dashboard");
    } catch (error) {
      console.log("err===", error.message);
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>시드 구문으로 계정 복구</h3>
      <input
        value={phrase}
        onChange={e => setPhrase(e.target.value)}
        placeholder="시드 구문 입력"
      />
      <input
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="비밀번호 입력"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={recoverAccount}>복구</button>
      )}
      <button style={{ marginTop: 10 }} onClick={() => navigate("/dashboard")}>
        {" "}
        {"<"} 뒤로가기
      </button>
    </div>
  );
};

export default ImportAccount;
