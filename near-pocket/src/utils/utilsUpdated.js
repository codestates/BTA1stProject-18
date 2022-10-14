import crypto from "crypto-js";
import axios from "axios";
import { generateSeedPhrase } from "near-seed-phrase";
import { KeyPair } from "near-api-js";

import { BASE_URL, OPEN_IN_WEB, STORAGE } from "../constants";

export const getStorageSyncValue = async keyName => {
  try {
    if (OPEN_IN_WEB) {
      return new Promise((resolve, reject) => {
        const item = localStorage.getItem(keyName);
        resolve(JSON.parse(item));
      });
    }
    return new Promise((resolve, reject) => {
      STORAGE?.get([keyName], function (extractedValue) {
        if (extractedValue[keyName]) {
          resolve(JSON.parse(extractedValue[keyName]));
        } else {
          resolve(false);
        }
      });
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const setStorageSyncValue = async (keyName, value) => {
  try {
    if (OPEN_IN_WEB) {
      return new Promise((resolve, reject) => {
        localStorage.setItem(keyName, JSON.stringify(value));
        resolve();
      });
    }
    return new Promise((resolve, reject) => {
      STORAGE?.set({ [keyName]: JSON.stringify(value) }, function () {
        resolve();
      });
    });
  } catch (error) {
    console.log("error setting the sync storage ", error);
  }
};

export const encryptMessage = (message, secret) => {
  const ciphertext = crypto.AES.encrypt(
    JSON.stringify(message),
    secret
  ).toString();

  return ciphertext;
};

export const decryptMessage = (cipherText, secret) => {
  let bytes = crypto.AES.decrypt(cipherText, secret);
  let decryptedText = JSON.parse(bytes.toString(crypto.enc.Utf8));

  return decryptedText;
};

export const initialTasks = async activeWallet => {
  let userInfo = await getStorageSyncValue("userInfo");
  let accountsList = userInfo[activeWallet]["accounts"];
  let accountID = userInfo[activeWallet].accountID;
  let firstUser = accountsList[Object.keys(accountsList)[0]];

  let { data, secretKey, address } = firstUser;
  let hashedPassword = await getStorageSyncValue("hashedPassword");
  const mnemonic = await decryptMessage(data, hashedPassword);
  const privateKey = await decryptMessage(secretKey, hashedPassword);

  return {
    firstUser,
    secret: privateKey,
    mnemonic,
    address,
    accountID,
    allAccounts: Object.keys(userInfo),
  };
};

export const showAllHoldings = async (accountID, near) => {
  const { data } = await axios.get(
    `${BASE_URL}/account/${accountID}/likelyTokens`
  );

  const account = await near.account(accountID);
  let tokensInfo = [];
  await Promise.all(
    data.map(async token => {
      let tokenInfo = await account.viewFunction(token, "ft_metadata", {
        account_id: accountID,
      });

      let balance = await account.viewFunction(token, "ft_balance_of", {
        account_id: accountID,
      });

      tokensInfo.push({
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        balance: balance / 10 ** tokenInfo.decimals,
        contractName: token,
        decimals: tokenInfo.decimals,
      });
    })
  );

  return tokensInfo;
};

export const setDataWithExpiry = (key, data, expiry) => {
  const now = new Date();

  const item = {
    data,
    expiry: now.getTime() + expiry,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const generateSeed = entropy => {
  const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
  const recoveryKeyPair = KeyPair.fromString(secretKey);
  return {
    phrase: seedPhrase,
    address: recoveryKeyPair.getPublicKey().toString(),
    secret: recoveryKeyPair.secretKey,
  };
};

export const checkAccountStatus = async accountInfo => {
  try {
    await accountInfo.state();
    return true;
  } catch (error) {
    console.log("er=====", error);
    return false;
  }
};

export const fetchBalance = async account => {
  const balance = await account.getAccountBalance();
  console.log("AHahh", balance);
  return balance.available / 10 ** 24;
};

export let controller;

export async function getAccountIds(publicKey) {
  controller = new AbortController();
  return await fetch(`${BASE_URL}/publicKey/${publicKey}/accounts`, {
    signal: controller.signal,
  }).then(res => res.json());
}
