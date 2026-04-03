import { useState } from "react";
import { ethers } from "ethers";

const buttonStyle = {
  background: "linear-gradient(135deg, #ff7a18, #af002d 85%)",
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  padding: "0.85rem 1.25rem",
  fontSize: "0.95rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 16px 30px rgba(175, 0, 45, 0.25)",
};

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask is not installed in this browser.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0] || "");
    } catch (connectError) {
      setError(connectError.message || "Wallet connection failed.");
    }
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        flexWrap: "wrap",
      }}
    >
      <button type="button" onClick={connectWallet} style={buttonStyle}>
        {walletAddress ? "Wallet Connected" : "Connect MetaMask"}
      </button>
      {walletAddress ? (
        <span style={{ color: "#1b1b1b", fontWeight: 600 }}>{shortAddress}</span>
      ) : null}
      {error ? (
        <span style={{ color: "#a61b3c", fontSize: "0.9rem" }}>{error}</span>
      ) : null}
    </div>
  );
}
