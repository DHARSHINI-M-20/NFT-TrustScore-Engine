import { network } from "hardhat";

const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
const recipientAddress = process.env.NFT_RECIPIENT_ADDRESS;
const tokenUri = process.env.NFT_TOKEN_URI ?? "https://example.com/metadata/1.json";

async function main() {
  const rawPrivateKey = process.env.PRIVATE_KEY?.trim();
  const normalizedPrivateKey =
    rawPrivateKey == null || rawPrivateKey === ""
      ? undefined
      : rawPrivateKey.startsWith("0x")
        ? rawPrivateKey
        : `0x${rawPrivateKey}`;

  if (!contractAddress) {
    throw new Error("Missing NFT_CONTRACT_ADDRESS in .env");
  }

  if (!/^0x[0-9a-fA-F]{40}$/.test(contractAddress)) {
    throw new Error("NFT_CONTRACT_ADDRESS in .env must be a valid 42-character wallet/contract address");
  }

  if (normalizedPrivateKey == null || !/^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey)) {
    throw new Error(
      "PRIVATE_KEY in .env must be a 64-character hex private key, usually starting with 0x",
    );
  }

  if (recipientAddress && !/^0x[0-9a-fA-F]{40}$/.test(recipientAddress)) {
    throw new Error("NFT_RECIPIENT_ADDRESS in .env must be a valid 42-character wallet address");
  }

  const { ethers } = await network.connect();
  const [signer] = await ethers.getSigners();
  const to = recipientAddress ?? signer.address;

  if (!signer.provider) {
    throw new Error("No signer available for the selected network. Check PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(signer.address);
  if (balance === 0n) {
    throw new Error(
      `Wallet ${signer.address} has 0 AMOY test MATIC. Fund it from a Polygon Amoy faucet before minting.`,
    );
  }

  const nft = await ethers.getContractAt("MyNFT", contractAddress, signer);
  const tx = await nft.mintNFT(to, tokenUri);

  await tx.wait();

  console.log("NFT Minted!");
  console.log("Contract:", contractAddress);
  console.log("Recipient:", to);
  console.log("Token URI:", tokenUri);
  console.log("Tx Hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
