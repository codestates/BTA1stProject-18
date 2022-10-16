import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import {
  CREATE_WALLET,
  IMPORT_WALLET,
  SET_CURRENT_WALLET_NAME,
  SWITCH_ACCOUNT,
} from "../../redux/actionTypes";

const Recover = () => {
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const { setAlert } = useAlert();
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleTypeConfirmMnemonics = (e) => {
    //setMnemonicError(false);
    setPhrase(e.target.value);
  };
  const handleTypeConfirmPassword = (e) => {
    //setMnemonicError(false);
    setPassword(e.target.value);
  };

  const recoverAccount = async () => {
    try {
      const split = phrase.split(" ");
      if (split.length === 1) {
        throw new Error("유효하지 않은 시드 문구입니다.");
      }
      if (!phrase) return;
      if (!password) {
        setAlert('error', "패스워드를 입력해주세요.");
        //alert("패스워드를 입력해주세요.");
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
      setAlert('error', error.message);
      //alert(error.message);
    }
  };

  return (
    <Box>
      <EntryHeader />
      <Typography variant='h6' align='center'>
        시드 구문으로 계정 복구
      </Typography>
      <Typography variant='subtitle2' sx={{ color: '#636363' }} align='center' mt={2}>
        시드 구문과 비밀번호를 입력해주세요.
      </Typography>
      <Box mt={5}>
        <TextField label='시드 구문 입력' fullWidth variant='outlined' onChange={handleTypeConfirmMnemonics} />
      </Box>
      <Box mt={5}>
        <TextField label='비밀번호 입력' fullWidth variant='outlined' onChange={handleTypeConfirmPassword} />
      </Box>
      {/* {mnemonicError && (
        <Typography variant='subtitle2' align='left' sx={{ color: 'red' }} mt={2} mb={2}>
          시드 구문이 일치하지 않습니다.
        </Typography>
      )} */}
      <Box mt={5}>
        <Button onClick={recoverAccount} fullWidth variant='contained' disabled={!password || !phrase}>
          복구
        </Button>
        <Button onClick={() => navigate("/dashboard")} fullWidth variant='contained' >
          뒤로가기
        </Button>
      </Box>
      {loading && <LoadingSpinner />}
    </Box>

  );
};

export default Recover;
