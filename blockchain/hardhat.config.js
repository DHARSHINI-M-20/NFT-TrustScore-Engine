import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import dotenv from "dotenv";

dotenv.config();

const amoyRpcUrl = process.env.AMOY_RPC_URL;
const rawPrivateKey = process.env.PRIVATE_KEY?.trim();
const normalizedPrivateKey =
  rawPrivateKey == null || rawPrivateKey === ""
    ? undefined
    : rawPrivateKey.startsWith("0x")
      ? rawPrivateKey
      : `0x${rawPrivateKey}`;
const hasValidPrivateKey =
  normalizedPrivateKey != null && /^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey);

const networks = {};

networks.localhost = {
  type: "http",
  url: "http://127.0.0.1:8545",
};

if (amoyRpcUrl) {
  networks.amoy = {
    type: "http",
    url: amoyRpcUrl,
    ...(hasValidPrivateKey ? { accounts: [normalizedPrivateKey] } : {}),
  };
}

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  solidity: "0.8.28",
  networks,
});
