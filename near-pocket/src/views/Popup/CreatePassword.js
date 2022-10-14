import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { setStorageSyncValue } from "../../utils/utilsUpdated";

const CreatePassword = () => {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const createPassword = async () => {
    if (!password) {
      alert("Password is required");
    } else {
      await setStorageSyncValue("hashedPassword", password);

      navigate("/seed-phrase");
    }
  };

  return (
    <div>
      <h1>Enter password</h1>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
      />

      <button onClick={createPassword}>Submit</button>
    </div>
  );
};

export default CreatePassword;
