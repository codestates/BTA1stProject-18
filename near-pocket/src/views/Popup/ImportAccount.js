import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';
import EntryHeader from '../../components/EntryHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAlert from '../../hooks/useAlert';

import {
  encryptMessage,
  getAccountIds,
  getStorageSyncValue,
  setStorageSyncValue,
} from "../../utils/utilsUpdated";
import { parseSeedPhrase } from "near-seed-phrase";
import { KeyPair } from "near-api-js";
import { SWITCH_ACCOUNT } from "../../redux/actionTypes";
import { CONFIG } from "../../constants";

const ImportAccount = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const handleTypeConfirmMnemonics = (e) => {
    setPhrase(e.target.value);
  };

  const importAccount = async () => {
    
    try {
      
      if (phrase.startsWith("ed25519:")) {
        //프라이빗키로 입력받은 경우
        secretKey = phrase;
      } else {
        //시드 구문으로 입력받은 경우
        const split = phrase.split(" ");
        if (split.length === 1) {
          setAlert('error', "유효하지 않은 시드 구문입니다.");
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
        setAlert('error', "유효하지 않은 시드 구문입니다.");
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
        setAlert('error', "해당 계정은 이미 존재합니다.");
        //alert("해당 계정은 이미 존재합니다.");
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
      setAlert('error', error.message);
      //alert(error.message);
    }
  };

  return (
    <Box>
      <EntryHeader />
      <Typography variant='h6' align='center'>
        시드 구문 / 시크릿키로 계정 가져오기
      </Typography>
      
      <Box mt={5}>
        <TextField label='시드 구문 / 시크릿키 입력' fullWidth variant='outlined' onChange={handleTypeConfirmMnemonics} />
      </Box>
      
      <Box mt={5}>
        <Button onClick={importAccount} fullWidth variant='contained' disabled={!phrase}>
          가져오기
        </Button>
      </Box>
      {loading && <LoadingSpinner />}
    </Box>

  );
};

export default ImportAccount;
