import { network } from "hardhat";

async function main() {
  const activeNetwork = process.env.HARDHAT_NETWORK ?? "hardhat";
  const rawPrivateKey = process.env.PRIVATE_KEY?.trim();
  const normalizedPrivateKey =
    rawPrivateKey == null || rawPrivateKey === ""
      ? undefined
      : rawPrivateKey.startsWith("0x")
        ? rawPrivateKey
        : `0x${rawPrivateKey}`;

  if (activeNetwork === "amoy" && !process.env.AMOY_RPC_URL) {
    throw new Error("Missing AMOY_RPC_URL in .env");
  }

  if (
    activeNetwork === "amoy" &&
    (normalizedPrivateKey == null || !/^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey))
  ) {
    throw new Error(
      "PRIVATE_KEY in .env must be a 64-character hex private key, usually starting with 0x",
    );
  }

  const { ethers } = await network.connect();
  const [signer] = await ethers.getSigners();

  if (!signer.provider) {
    throw new Error("No signer available for the selected network. Check PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(signer.address);
  if (activeNetwork === "amoy" && balance === 0n) {
    throw new Error(
      `Wallet ${signer.address} has 0 AMOY test MATIC. Fund it from a Polygon Amoy faucet before deploying.`,
    );
  }

  const NFT = await ethers.getContractFactory("MyNFT", signer);
  const nft = await NFT.deploy();

  await nft.waitForDeployment();

  console.log("NFT deployed to:", await nft.getAddress());
  console.log("Network:", activeNetwork);
  console.log("Deployer:", signer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
