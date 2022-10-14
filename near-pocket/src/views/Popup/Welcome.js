import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PopupPage = props => {
  const navigate = useNavigate();
  const wallet = localStorage.getItem("wallet");

  useEffect(() => {
    if (wallet) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div style={{ height: 300, width: 300 }}>
      <Link to="/recover">
        <button>Recover Wallet</button>
      </Link>
      <Link to="/create-password">
        <button>Create a wallet</button>
      </Link>
    </div>
  );
};

export default PopupPage;
