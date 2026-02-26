import Link from "next/link";

export default function FeedRightRail() {
  const popularTiles = [
    {
      id: "p1",
      title: "The Night I Decided to Stop Begging Life",
      img: "https://picsum.photos/seed/pop1/300/300",
    },
    { id: "p2", title: "A Soft Place to Land", img: "https://picsum.photos/seed/pop2/300/300" },
    { id: "p3", title: "Hustle Culture is Killing Us", img: "https://picsum.photos/seed/pop3/300/300" },
    { id: "p4", title: "My Mother’s Hands", img: "https://picsum.photos/seed/pop4/300/300" },
  ];

  const suggested = [
    { id: "s1", title: "10 habits of writers who actually finish stories" },
    { id: "s2", title: "A love story that ends before it begins" },
    { id: "s3", title: "How to write scenes that feel alive" },
    { id: "s4", title: "The day I stopped fearing rejection" },
  ];

  const creators = [
    { name: "Blessing Oba", tag: "Fiction • Growth" },
    { name: "Amina Writes", tag: "Poetry • Life" },
    { name: "Kola Stories", tag: "Short stories" },
  ];

  const boxStyle: React.CSSProperties = {
    border: "1px solid var(--hp-border)",
    borderRadius: 16,
    padding: 14,
    background: "var(--hp-card)",
    boxShadow: "var(--hp-shadow-card)",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 950,
    fontSize: 13,
    color: "var(--hp-text)",
    marginBottom: 10,
    letterSpacing: -0.1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Popular Stories (Squares) */}
      <div style={boxStyle}>
        <div style={titleStyle}>Popular stories</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {popularTiles.map((t) => (
            <Link
              key={t.id}
              href={`/post/${t.id}`}
              style={{
                textDecoration: "none",
                color: "var(--hp-text)",
                border: "1px solid var(--hp-border)",
                borderRadius: 14,
                overflow: "hidden",
                background: "var(--hp-card)",
                display: "block",
                boxShadow: "0 6px 16px rgba(17, 17, 26, 0.05)",
                transition: "transform 160ms ease, box-shadow 160ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 14px 30px rgba(17, 17, 26, 0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 16px rgba(17, 17, 26, 0.05)";
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={t.img}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* soft tint overlay for brand feel */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(124,108,255,0.00), rgba(124,108,255,0.10))",
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div style={{ padding: 9, fontSize: 12, fontWeight: 850, lineHeight: 1.25 }}>
                {t.title}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div style={boxStyle}>
        <div style={titleStyle}>Suggested for you</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggested.map((s) => (
            <Link
              key={s.id}
              href={`/post/${s.id}`}
              style={{
                textDecoration: "none",
                color: "var(--hp-text)",
                fontSize: 13,
                fontWeight: 650,
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid transparent",
                background: "transparent",
                transition: "background 160ms ease, border-color 160ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--hp-surface)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--hp-border)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Follow creators */}
      <div style={boxStyle}>
        <div style={titleStyle}>Who to follow</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {creators.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: "var(--hp-text)",
                    fontWeight: 850,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    color: "var(--hp-muted)",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.tag}
                </div>
              </div>

              <button
                type="button"
                className="hp-primary"
                style={{
                  padding: "7px 12px",
                  borderRadius: 999,
                  border: "none",
                  fontWeight: 850,
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={() => alert("Follow (dummy for now)")}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}