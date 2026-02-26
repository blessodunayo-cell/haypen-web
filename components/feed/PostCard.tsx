import Link from "next/link";

type PostCardProps = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  views: number;
  cover?: string;
};

export default function PostCard({
  id,
  title,
  excerpt,
  author,
  category,
  readTime,
  views,
  cover,
}: PostCardProps) {
  return (
    <article
      className="hp-card"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        transition: "transform 160ms ease, box-shadow 160ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 14px 30px rgba(17, 17, 26, 0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--hp-shadow-card)";
      }}
    >
      {cover ? (
        <Link href={`/post/${id}`} style={{ display: "block" }}>
          <div style={{ position: "relative" }}>
            <img
              src={cover}
              alt=""
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* soft overlay to blend image into theme */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.00), rgba(0,0,0,0.12))",
                pointerEvents: "none",
              }}
            />
          </div>
        </Link>
      ) : null}

      <div style={{ padding: 16 }}>
        <Link
          href={`/post/${id}`}
          style={{ textDecoration: "none", color: "var(--hp-text)" }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: -0.2,
              lineHeight: 1.25,
            }}
          >
            {title}
          </h2>
        </Link>

        <p
          className="hp-muted"
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {excerpt}
        </p>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "var(--hp-muted)",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--hp-text)" }}>
            {author}
          </span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>{category}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>{readTime}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>{views.toLocaleString()} views</span>
        </div>
      </div>
    </article>
  );
}