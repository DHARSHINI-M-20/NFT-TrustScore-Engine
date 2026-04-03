const panelStyle = {
  background: "rgba(255, 255, 255, 0.88)",
  border: "1px solid rgba(22, 27, 45, 0.08)",
  borderRadius: "24px",
  padding: "1.25rem",
  boxShadow: "0 24px 50px rgba(18, 32, 73, 0.08)",
  backdropFilter: "blur(12px)",
};

const actionStyle = {
  border: "none",
  borderRadius: "14px",
  padding: "0.75rem 0.95rem",
  fontWeight: 700,
  cursor: "pointer",
};

export default function NFTCard({
  nft,
  scoreData,
  loadingScore,
  scoreError,
  onRefreshScore,
  onAddView,
  onLike,
}) {
  return (
    <article style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <p style={{ margin: 0, color: "#8c5e34", fontSize: "0.85rem", fontWeight: 700 }}>
            TOKEN #{nft.tokenId ?? "N/A"}
          </p>
          <h3 style={{ margin: "0.35rem 0", color: "#101423" }}>{nft.name || "Unnamed NFT"}</h3>
          <p style={{ margin: 0, color: "#5f6575" }}>{nft.creator || "Unknown creator"}</p>
        </div>
        <div
          style={{
            minWidth: "86px",
            textAlign: "center",
            borderRadius: "18px",
            padding: "0.8rem",
            background: "linear-gradient(180deg, #fff3d8, #ffe0b1)",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#8c5e34", fontWeight: 700 }}>Trust</div>
          <div style={{ fontSize: "1.75rem", color: "#111827", fontWeight: 800 }}>
            {scoreData?.trustScore ?? nft.trustScore ?? "--"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.75rem",
          color: "#283041",
        }}
      >
        <div>Views: {nft.views ?? 0}</div>
        <div>Likes: {nft.likes ?? 0}</div>
        <div>Transactions: {nft.transactions ?? 0}</div>
        <div>Rarity: {nft.rarity ?? 0}</div>
      </div>

      {scoreData?.breakdown ? (
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.65rem",
            fontSize: "0.92rem",
            color: "#4b5565",
          }}
        >
          <div>Popularity: {scoreData.breakdown.popularity}</div>
          <div>Engagement: {scoreData.breakdown.engagement}</div>
          <div>Transactions: {scoreData.breakdown.transactions}</div>
          <div>Rarity: {scoreData.breakdown.rarity}</div>
          <div>Creator Rep: {scoreData.breakdown.creatorReputation}</div>
          <div>Freshness: {scoreData.breakdown.freshness}</div>
        </div>
      ) : null}

      {scoreError ? (
        <p style={{ marginTop: "1rem", color: "#a61b3c", fontWeight: 600 }}>{scoreError}</p>
      ) : null}

      <div
        style={{
          marginTop: "1.1rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => onRefreshScore(nft._id)}
          style={{
            ...actionStyle,
            background: "#111827",
            color: "#fff",
          }}
          disabled={loadingScore}
        >
          {loadingScore ? "Scoring..." : "Get Live Score"}
        </button>
        <button
          type="button"
          onClick={() => onAddView(nft._id)}
          style={{
            ...actionStyle,
            background: "#eef2ff",
            color: "#283593",
          }}
        >
          Add View
        </button>
        <button
          type="button"
          onClick={() => onLike(nft._id)}
          style={{
            ...actionStyle,
            background: "#fff1f2",
            color: "#be123c",
          }}
        >
          Like NFT
        </button>
      </div>
    </article>
  );
}
