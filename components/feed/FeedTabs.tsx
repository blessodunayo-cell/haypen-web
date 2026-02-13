import Link from "next/link";

export default function FeedTabs({ active = "for-you" }: { active?: string }) {
  const tabs = [
    { key: "for-you", label: "For You" },
    { key: "latest", label: "Latest" },
    { key: "following", label: "Following" },
    { key: "popular", label: "Popular" },
  ];

  return (
    <div
      style={{
        borderBottom: "1px solid #2a2a2a",
        background: "#0b0b0b",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <Link
              key={t.key}
              href={`/feed?tab=${t.key}`}
              style={{
                textDecoration: "none",
                color: isActive ? "white" : "#bbb",
                fontWeight: 800,
                fontSize: 13,
                padding: "7px 12px",
                borderRadius: 999,
                border: isActive ? "1px solid #3a3a3a" : "1px solid transparent",
                background: isActive ? "#111" : "transparent",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
