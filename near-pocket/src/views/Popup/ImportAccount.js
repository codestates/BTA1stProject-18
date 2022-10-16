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
import { KeyPair, connect, WalletConnection } from "near-api-js";
import { SWITCH_ACCOUNT } from "../../redux/actionTypes";
import { CONFIG } from "../../constants";

const ImportAccount = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const importAccount = async () => {
    try {
      
      if (phrase.startsWith("ed25519:")) {
        //프라이빗키로 입력받은 경우
        secretKey = phrase;
      } else {
        //시드 구문으로 입력받은 경우
        const split = phrase.split(" ");
        if (split.length === 1) {
          throw new Error("유효하지 않은 시드 구문입니다.");
        }
        if (!phrase) return;
      }

      const { secretKey, seedPhrase } = parseSeedPhrase(phrase);

      const keyPair = KeyPair.fromString(secretKey);
      const publicKey = keyPair.publicKey.toString(); //키페어에 퍼블릭키를 가져온다.
      console.log(publicKey);

      const accountIdsByPublickKey = await getAccountIds(publicKey); //퍼블릭키로 Account ID를 가져온다.
      console.log("accountID: " + accountIdsByPublickKey);

      if (!phrase || accountIdsByPublickKey.length === 0) {
        throw new Error("유효하지 않은 시드 구문입니다.");
      }
      setLoading(true);

      let isExist = false;
      let userInfo = await getStorageSyncValue("userInfo");
      console.log(userInfo);
      for (let info in userInfo) {
        if (userInfo[info].accountID === accountIdsByPublickKey) {
          isExist = true;
        }
      }

      if (isExist) {
        alert("해당 계정은 이미 존재합니다.");
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
      console.log("error : ", error.message);
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>시드 구문 / 시크릿 키로 계정 가져오기</h3>
      <input value={phrase} onChange={e => setPhrase(e.target.value)} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={importAccount}>가져오기</button>
      )}
      <button style={{ marginTop: 10 }} onClick={() => navigate("/dashboard")}>
        {" "}
        {"<"} 뒤로가기
      </button>
    </div>
  );
};

export default ImportAccount;
