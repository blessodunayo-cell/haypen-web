import Link from "next/link";

export default function FeedRightRail() {
  const popularTiles = [
    { id: "p1", title: "The Night I Decided to Stop Begging Life", img: "https://picsum.photos/seed/pop1/300/300" },
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Popular Stories (Squares) */}
      <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 14, background: "#0f0f0f" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "white", marginBottom: 10 }}>
          Popular stories
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {popularTiles.map((t) => (
            <Link
              key={t.id}
              href={`/post/${t.id}`}
              style={{
                textDecoration: "none",
                color: "white",
                border: "1px solid #2a2a2a",
                borderRadius: 10,
                overflow: "hidden",
                background: "#111",
                display: "block",
              }}
            >
              <img src={t.img} alt="" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
              <div style={{ padding: 8, fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
                {t.title}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested */}
      <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 14, background: "#0f0f0f" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "white", marginBottom: 10 }}>
          Suggested for you
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggested.map((s) => (
            <Link
              key={s.id}
              href={`/post/${s.id}`}
              style={{ textDecoration: "none", color: "#ddd", fontSize: 13 }}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Follow creators */}
      <div style={{ border: "1px solid #2a2a2a", borderRadius: 12, padding: 14, background: "#0f0f0f" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "white", marginBottom: 10 }}>
          Who to follow
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {creators.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.name}
                </div>
                <div style={{ color: "#aaa", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.tag}
                </div>
              </div>

              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid #2a2a2a",
                  background: "transparent",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
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
