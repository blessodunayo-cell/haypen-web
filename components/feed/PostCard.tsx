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
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
      }}
    >
      {cover && (
        <Link href={`/post/${id}`}>
          <img
            src={cover}
            alt=""
            style={{ width: "100%", height: 220, objectFit: "cover" }}
          />
        </Link>
      )}

      <div style={{ padding: 16 }}>
        <Link
          href={`/post/${id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {title}
          </h2>
        </Link>

        <p style={{ marginTop: 10, color: "#555", fontSize: 14 }}>
          {excerpt}
        </p>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#777",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 600, color: "black" }}>{author}</span>
          <span>•</span>
          <span>{category}</span>
          <span>•</span>
          <span>{readTime}</span>
          <span>•</span>
          <span>{views.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  );
}
