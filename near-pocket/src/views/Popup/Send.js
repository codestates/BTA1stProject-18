import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CONFIG } from "../../constants";
import { connect, KeyPair, keyStores, transactions } from "near-api-js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { BN } from "bn.js";
import { initialTasks } from "../../utils/utilsUpdated";

const FT_TRANSFER_GAS = parseNearAmount("0.00000000003");
const FT_TRANSFER_DEPOSIT = "1";

const SendTokens = () => {
  const [loading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState("");

  const navigate = useNavigate();

  const currentWalletName = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.currentWalletName
  );

  const allTokens = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.allTokens
  );

  const activeWallet = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.activeWallet
  );

  const sendTransaction = async () => {
    setLoading(true);
    try {
      const { secret, accountID } = await initialTasks(activeWallet);
      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(secret);
      await keyStore.setKey("testnet", accountID, keyPair);

      const near = await connect({ ...CONFIG, keyStore });
      const senderAccount = await near.account(accountID);

      const yoctoAmount = parseNearAmount(amount);
      const convertedAmount = new BN(yoctoAmount);

      if (selectedAsset !== "") {
        let [contractAddress, decimals] = selectedAsset.split(":");
        console.log("OTHER SSETS TRANSFER", contractAddress, receiver);
        let transfer = await senderAccount.functionCall(
          contractAddress,
          "ft_transfer",
          {
            amount: (amount * 10 ** decimals).toString(),
            receiver_id: receiver,
          },
          FT_TRANSFER_GAS,
          FT_TRANSFER_DEPOSIT
        );
        console.log("HASH========", transfer);
      } else {
        console.log("NEAR TRANSFER");
        const transaction = await senderAccount.sendMoney(
          receiver,
          convertedAmount
        );
        console.log("HASH========", transaction.transaction.hash);
      }
      alert("성공적으로 송금되었습니다.");
      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("err=============", error.message);
      if (
        error.message.includes("no matching key pair found in InMemorySigner")
      ) {
        alert("해당 계정은 송금에 대한 권한이 없습니다.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <h3>니어 송금</h3>
      <select onChange={e => setSelectedAsset(e.target.value)}>
        <option value="">NEAR</option>
        {allTokens.map((tk, ind) => (
          <option key={ind} value={`${tk.contractName}:${tk.decimals}`}>
            {tk.name}
          </option>
        ))}
      </select>

      <input
        value={receiver}
        placeholder="Account ID 입력"
        onChange={e => setReceiver(e.target.value)}
      />
      <input
        value={amount}
        placeholder="금액 입력"
        onChange={e => setAmount(e.target.value)}
        type="number"
      />

      <>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button onClick={sendTransaction}>전송</button>
        )}
        <Link to="/dashboard">메인</Link>
      </>
    </div>
  );
};

export default SendTokens;
