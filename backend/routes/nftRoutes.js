const express = require("express");
const router = express.Router();

const {
    createNFT,
    getNFTs,
    getNFTById,
    addView,
    likeNFT,
    getTrustScore
} = require("../controllers/nftController");

router.post("/", createNFT);
router.get("/", getNFTs);
router.get("/:id", getNFTById);
router.post("/:id/view", addView);
router.post("/:id/like", likeNFT);
router.get("/:id/score", getTrustScore);

router.delete("/:id", async (req, res) => {
    try {
        const NFT = require("../models/NFT");
        const deleted = await NFT.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "NFT not found" });
        }

        res.json({ message: "NFT deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid NFT id" });
    }
});

module.exports = router;
