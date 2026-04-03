import NFTDashboard from "./components/NFTDashboard";
import WalletConnect from "./components/WalletConnect";

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(255, 202, 141, 0.8), transparent 28%), linear-gradient(135deg, #fff9f0 0%, #eef4ff 52%, #f5fbf4 100%)",
        padding: "2rem 1rem 4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid rgba(17, 24, 39, 0.08)",
            borderRadius: "32px",
            padding: "1.5rem",
            boxShadow: "0 28px 80px rgba(17, 24, 39, 0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#a15c1c",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  fontSize: "0.82rem",
                }}
              >
                AI TRUST SCORE ENGINE
              </p>
              <h1
                style={{
                  margin: "0.45rem 0 0.5rem",
                  fontSize: "clamp(2rem, 5vw, 3.7rem)",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                NFT Dashboard with live trust scoring
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: "#4b5565",
                  fontSize: "1rem",
                }}
              >
                Connect MetaMask, inspect on-chain style engagement signals, and request
                real-time trust scores from your Python AI service.
              </p>
            </div>
            <WalletConnect />
          </div>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <NFTDashboard />
        </section>
      </div>
    </main>
  );
}
