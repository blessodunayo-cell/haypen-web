import Link from "next/link";

export default function ExplorePage() {
  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 16,
  };

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Explore</h1>
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Discover stories, chapters, and writers.
          </p>
        </div>

        <Link
          href="/signup"
          style={{
            alignSelf: "center",
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Get started
        </Link>
      </div>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
            <span>Drama</span>
            <span>8 min read</span>
          </div>
          <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>
            My First Real Haypen Test Story
          </h3>
          <p style={{ marginTop: 6, opacity: 0.8 }}>by Ayin X</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
            <span>Romance</span>
            <span>6 min read</span>
          </div>
          <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>
            The Night We Chose Peace
          </h3>
          <p style={{ marginTop: 6, opacity: 0.8 }}>by Nadia Writes</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
            <span>Life</span>
            <span>5 min read</span>
          </div>
          <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>
            Small Wins, Big Joy
          </h3>
          <p style={{ marginTop: 6, opacity: 0.8 }}>by Kemi Stories</p>
        </div>
      </div>
    </main>
  );
}
