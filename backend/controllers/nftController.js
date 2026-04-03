const NFT = require("../models/NFT");
const axios = require("axios");

const HOURS_PER_MS = 1000 * 60 * 60;

const buildAiPayload = async (nft) => {
    const creatorFilter = nft.creator ? { creator: nft.creator } : { _id: nft._id };
    const creatorNfts = await NFT.find(creatorFilter).lean();

    const creatorPortfolioSize = creatorNfts.length;
    const creatorAvgViews = creatorPortfolioSize
        ? creatorNfts.reduce((sum, item) => sum + (item.views || 0), 0) / creatorPortfolioSize
        : nft.views || 0;
    const creatorAvgLikes = creatorPortfolioSize
        ? creatorNfts.reduce((sum, item) => sum + (item.likes || 0), 0) / creatorPortfolioSize
        : nft.likes || 0;
    const creatorAvgTransactions = creatorPortfolioSize
        ? creatorNfts.reduce((sum, item) => sum + (item.transactions || 0), 0) / creatorPortfolioSize
        : nft.transactions || 0;

    const scoredCreatorNfts = creatorNfts.filter((item) => typeof item.trustScore === "number");
    const creatorReputation = scoredCreatorNfts.length
        ? scoredCreatorNfts.reduce((sum, item) => sum + item.trustScore, 0) / scoredCreatorNfts.length
        : 50;

    const createdAt = nft.createdAt ? new Date(nft.createdAt).getTime() : Date.now();
    const ageHours = Math.max(0, (Date.now() - createdAt) / HOURS_PER_MS);

    const likeViewRatio = (nft.likes || 0) / Math.max(nft.views || 0, 1);
    const transactionViewRatio = (nft.transactions || 0) / Math.max(nft.views || 0, 1);

    const suspiciousActivity = Math.min(
        100,
        (
            (likeViewRatio > 0.8 ? 40 : likeViewRatio * 50) +
            (transactionViewRatio > 0.5 ? 40 : transactionViewRatio * 80) +
            ((nft.likes || 0) > (nft.views || 0) ? 20 : 0)
        )
    );

    return {
        views: nft.views || 0,
        likes: nft.likes || 0,
        transactions: nft.transactions || 0,
        rarity: nft.rarity || 0,
        creatorReputation: Number(creatorReputation.toFixed(2)),
        creatorPortfolioSize,
        creatorAvgViews: Number(creatorAvgViews.toFixed(2)),
        creatorAvgLikes: Number(creatorAvgLikes.toFixed(2)),
        creatorAvgTransactions: Number(creatorAvgTransactions.toFixed(2)),
        ageHours: Number(ageHours.toFixed(2)),
        suspiciousActivity: Number(suspiciousActivity.toFixed(2))
    };
};

// Create NFT entry
exports.createNFT = async (req, res) => {
    try {
        console.log("BODY:", req.body); // debug

        const nft = new NFT(req.body);
        const savedNFT = await nft.save();

        console.log("SAVED:", savedNFT);

        res.status(201).json(savedNFT); // IMPORTANT

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get all NFTs
exports.getNFTs = async (req, res) => {
    const nfts = await NFT.find();
    res.json(nfts);
};

// Get one NFT by id
exports.getNFTById = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ error: "NFT not found" });
        }

        res.json(nft);
    } catch (err) {
        res.status(400).json({ error: "Invalid NFT id" });
    }
};

// Update views
exports.addView = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ error: "NFT not found" });
        }

        nft.views += 1;
        await nft.save();
        res.json(nft);
    } catch (err) {
        res.status(400).json({ error: "Invalid NFT id" });
    }
};

// Like NFT
exports.likeNFT = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ error: "NFT not found" });
        }

        nft.likes += 1;
        await nft.save();
        res.json(nft);
    } catch (err) {
        res.status(400).json({ error: "Invalid NFT id" });
    }
};

// Call AI Model for Trust Score
exports.getTrustScore = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ error: "NFT not found" });
        }

        console.log("SENDING TO AI:", nft);

        const payload = await buildAiPayload(nft);

        const response = await axios.post("http://127.0.0.1:5001/predict", payload);

        console.log("AI RESPONSE:", response.data);

        const score = response.data.trustScore;

        nft.trustScore = score;
        await nft.save();

        res.json({
            trustScore: score,
            breakdown: response.data.breakdown,
            inputs: payload
        });

    } catch (err) {
        console.error("ERROR:", err.message);
        const statusCode = err.name === "CastError" ? 400 : 500;
        res.status(statusCode).json({ error: err.name === "CastError" ? "Invalid NFT id" : err.message });
    }
};
