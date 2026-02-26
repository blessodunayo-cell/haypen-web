import Link from "next/link";

export default function FeedTabs({ active = "for-you" }: { active?: string }) {
  const tabs = [
    { key: "for-you", label: "For You" },
    { key: "latest", label: "Latest" },
    { key: "following", label: "Following" },
    { key: "series", label: "Series" },
  ];

  return (
    <div
      style={{
        borderBottom: "1px solid var(--hp-border)",
        background: "var(--hp-surface)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 20px",
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
                color: isActive ? "white" : "var(--hp-text)",
                fontWeight: 800,
                fontSize: 13,
                padding: "8px 14px",
                borderRadius: 999,
                border: isActive
                  ? "1px solid transparent"
                  : "1px solid var(--hp-border)",
                background: isActive
                  ? "linear-gradient(135deg, #7c6cff, #a88cff)"
                  : "var(--hp-card)",
                boxShadow: isActive ? "0 6px 18px rgba(124,108,255,0.35)" : "none",
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