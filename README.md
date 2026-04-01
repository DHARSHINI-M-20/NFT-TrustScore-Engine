# NFT TrustScore Engine

This project is an AI-powered NFT marketplace that helps users understand how trustworthy and valuable an NFT is, not just based on price but using actual data and analysis.

Unlike traditional NFT platforms that only show price or popularity, this system introduces a Trust Score (0–100) calculated using factors like user engagement, rarity, and transaction history. The score is also stored on the blockchain to make it secure and tamper-proof.

## Idea Behind the Project

In most NFT marketplaces, users don’t really know if an NFT is genuinely valuable or just driven by hype.

This project addresses that problem by:

* Using AI to analyze NFT data
* Assigning each NFT a trust or recommendation score
* Storing that score on the blockchain for transparency

## Tech Stack

* Blockchain: Solidity, Hardhat, Polygon (Amoy Testnet)
* Frontend: React.js
* Backend: Node.js, Express.js
* AI Model: Python (pandas, scikit-learn)
* Storage: IPFS (metadata), MongoDB (user interactions)
* Wallet: MetaMask

## How It Works

1. User connects their wallet using MetaMask
2. NFTs are created and stored on Polygon
3. Metadata is stored using IPFS
4. User interactions such as views and likes are tracked
5. The AI model calculates a Trust Score
6. The score is displayed in the frontend
7. The score is stored on the blockchain for verification

## Trust Score Logic (Basic)

The score is calculated using a simple formula:

Score = (views × 0.4) + (likes × 0.3) + (transactions × 0.2) + (rarity × 0.1)

This can be improved later using more advanced machine learning models.

## How to Run the Project

Clone the repository:
git clone https://github.com/YOUR-USERNAME/NFT-TrustScore-Engine.git
cd NFT-TrustScore-Engine

Setup blockchain:
cd blockchain
npm install
npx hardhat

Setup backend:
cd backend
npm install
npm start

Setup AI model:
cd ai-model
pip install pandas scikit-learn flask
python app.py

Setup frontend:
cd frontend
npm install
npm start

## Future Improvements

* Improve AI model accuracy
* Add fake NFT detection
* Implement creator reputation system
* Enable real-time updates
* Add recommendation features

## Author

Aruthra B, Dharshini M,Kanishka R, Raja Rageshwari. 

## Note

This project is built for learning purposes and demonstrates how AI and blockchain can be combined in a practical application.