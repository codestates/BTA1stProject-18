import { createStore, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers";
// let transforms = [];
// const encryptionTransform = encryptTransform({
//   secretKey: process.env.MY_SECRET_KEY,
// });
// transforms.push(encryptionTransform);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware()
  // other store enhancers if any
);
const persistConfig = {
  key: "root",
  // storage,
  // storage: storageSession,
  storage,
  whitelist: ["walletEncrypted"],
};
// persistConfig.transforms = transforms;
const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(
  persistedReducer,

  composeEnhancers(applyMiddleware(thunk))
);
let persistor = persistStore(store);
export { store, persistor };
