import Link from "next/link";

export default function WritePage() {
  const boxStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 18,
  };

  const pillStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.2)",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
  };

  return (
    <main style={{ maxWidth: 780, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Write</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Create a post and publish it on Haypen.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        <div style={boxStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            Your Haypen Channel
          </h2>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Your Channel is where readers follow you and read everything you publish.
          </p>

          <p style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>
            To start writing, create your account and set up your Channel.
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/signup" style={pillStyle}>
              Create account
            </Link>

            <Link href="/explore" style={{ ...pillStyle, opacity: 0.9 }}>
              Explore posts
            </Link>
          </div>
        </div>

        <div style={boxStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            Writing guidelines
          </h3>
          <ul style={{ marginTop: 10, opacity: 0.85, lineHeight: 1.8 }}>
            <li>Each post is published independently.</li>
            <li>Stories and articles must meet minimum word requirements.</li>
            <li>Writers are responsible for their content.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
