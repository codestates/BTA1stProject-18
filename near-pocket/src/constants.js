/*global chrome*/
import { keyStores } from "near-api-js";

export const CURRENTLY_IN_DEVELOPMENT = true;

export const OPEN_IN_WEB = chrome.storage ? false : true;

export const STORAGE = OPEN_IN_WEB ? undefined : chrome.storage.sync;
export const COMMITMENT = "confirmed";
export const SOLANA_SYMBOL = "solana";
export const CACHE_TIME = 60000;
export const USD_CACHE_TIME = 120000;

export const CURRENT_NETWORK = "testnet";
export const ACCOUNT_HELPER_URL = `https://near-contract-helper.onrender.com`;

export const BASE_URL = "https://api.kitwallet.app";

export const CONFIG = {
  networkId: CURRENT_NETWORK,
  keyStore: new keyStores.InMemoryKeyStore(),
  // nodeUrl: `https://archival-rpc.${CURRENT_NETWORK}.near.org`,
  // walletUrl: `https://wallet.${CURRENT_NETWORK}.near.org`,
  // explorerUrl: `https://explorer.${CURRENT_NETWORK}.near.org`,
  //helperUrl: BASE_URL,
  helperUrl: "https://helper.testnet.near.org",
  nodeUrl: `https://rpc.testnet.near.org`,
  walletUrl: `https://wallet.near.org`,
  explorerUrl: `https://explorer.near.org`,
};
