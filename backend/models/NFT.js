const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
    tokenId: Number,
    name: String,
    creator: String,
    metadataURI: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    transactions: { type: Number, default: 0 },
    rarity: Number,
    trustScore: Number
}, { timestamps: true });

module.exports = mongoose.model("NFT", nftSchema);
