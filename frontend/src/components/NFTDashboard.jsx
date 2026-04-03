import { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { fetchNFTs, fetchTrustScore, incrementView, likeNFT } from "../api";

export default function NFTDashboard() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scoreById, setScoreById] = useState({});
  const [loadingScoreId, setLoadingScoreId] = useState("");
  const [scoreErrorById, setScoreErrorById] = useState({});

  const loadNFTs = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNFTs();
      setNfts(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.error ||
          "Could not load NFTs. Check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  const handleRefreshScore = async (id) => {
    setLoadingScoreId(id);
    setScoreErrorById((current) => ({ ...current, [id]: "" }));

    try {
      const data = await fetchTrustScore(id);
      setScoreById((current) => ({ ...current, [id]: data }));
      setNfts((current) =>
        current.map((nft) =>
          nft._id === id ? { ...nft, trustScore: data.trustScore } : nft
        )
      );
    } catch (scoreError) {
      setScoreErrorById((current) => ({
        ...current,
        [id]:
          scoreError.response?.data?.error ||
          "Score request failed. Make sure the AI server is running on port 5001.",
      }));
    } finally {
      setLoadingScoreId("");
    }
  };

  const handleAddView = async (id) => {
    try {
      const updated = await incrementView(id);
      setNfts((current) => current.map((nft) => (nft._id === id ? updated : nft)));
    } catch (viewError) {
      setError(viewError.response?.data?.error || "Could not update views.");
    }
  };

  const handleLike = async (id) => {
    try {
      const updated = await likeNFT(id);
      setNfts((current) => current.map((nft) => (nft._id === id ? updated : nft)));
    } catch (likeError) {
      setError(likeError.response?.data?.error || "Could not like NFT.");
    }
  };

  if (loading) {
    return <p style={{ color: "#394150" }}>Loading NFT dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: "#a61b3c", fontWeight: 700 }}>{error}</p>;
  }

  if (!nfts.length) {
    return (
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(22,27,45,0.08)",
        }}
      >
        <p style={{ margin: 0, color: "#394150" }}>
          No NFTs found yet. Create one in the backend first, then refresh this page.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
      }}
    >
      {nfts.map((nft) => (
        <NFTCard
          key={nft._id}
          nft={nft}
          scoreData={scoreById[nft._id]}
          loadingScore={loadingScoreId === nft._id}
          scoreError={scoreErrorById[nft._id]}
          onRefreshScore={handleRefreshScore}
          onAddView={handleAddView}
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
