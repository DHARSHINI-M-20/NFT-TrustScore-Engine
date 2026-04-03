const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const nftRoutes = require("./routes/nftRoutes");
app.use("/api/nfts", nftRoutes);

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Missing MONGO_URI in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        if (error.code === "ETIMEOUT" || error.code === "ECONNREFUSED") {
            console.error(
                "MongoDB Atlas DNS/network lookup failed. Check your internet connection, Atlas IP allowlist, and try a non-SRV Mongo URI if needed.",
            );
        }

        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
