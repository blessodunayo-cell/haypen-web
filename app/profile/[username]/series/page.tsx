"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  subscribers_count: number | null;
};

type SeriesRow = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  slug: string;
  created_at: string;
  is_public: boolean;
  is_active: boolean;
};

export default function ProfileSeriesPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "writer";
  const supabase = createClient();

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [seriesList, setSeriesList] = useState<SeriesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileAndSeries() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, display_name, subscribers_count")
          .eq("username", username)
          .single();

        if (profileError || !profileData) {
          if (!cancelled) {
            setNotFound(true);
            setProfile(null);
            setSeriesList([]);
          }
          return;
        }

        if (cancelled) return;

        setProfile(profileData);

        const { data: seriesData, error: seriesError } = await supabase
          .from("series")
          .select(
            "id, title, description, cover_url, slug, created_at, is_public, is_active"
          )
          .eq("author_id", profileData.id)
          .eq("is_public", true)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (seriesError) {
          throw seriesError;
        }

        if (!cancelled) {
          setSeriesList(seriesData ?? []);
        }
      } catch (err) {
        console.error("Failed to load public series page:", err);
        if (!cancelled) {
          setError("Could not load this writer's series right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfileAndSeries();

    return () => {
      cancelled = true;
    };
  }, [username, supabase]);

  const headingName =
    profile?.display_name?.trim() || String(username).toUpperCase();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
      }}
    >
      <div
        className="hp-topnav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            maxWidth: 1240,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
            Haypen
          </div>

          <Link
            href={`/profile/${username}`}
            className="hp-btn"
            style={softPill()}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>←</span>
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 36px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13, color: "var(--hp-muted)" }}>Series</div>

            <h1
              style={{
                margin: "14px 0 0",
                fontSize: 32,
                fontWeight: 950,
                letterSpacing: 0.2,
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              {headingName}'S SERIES
            </h1>

            <div style={{ marginTop: 12, fontSize: 15, color: "var(--hp-muted)" }}>
              {profile
                ? `${profile.subscribers_count ?? 0} subscribers • Writer`
                : "Explore story collections from this writer."}
            </div>
          </div>

          {loading ? (
            <div style={infoBoxStyle()}>Loading series...</div>
          ) : notFound ? (
            <div style={infoBoxStyle()}>This writer could not be found.</div>
          ) : error ? (
            <div style={infoBoxStyle()}>{error}</div>
          ) : seriesList.length === 0 ? (
            <div style={infoBoxStyle()}>No public series yet.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {seriesList.map((s) => (
                <SeriesCard key={s.id} username={String(username)} series={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SeriesCard({
  username,
  series,
}: {
  username: string;
  series: SeriesRow;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      href={`/profile/${username}/series/${series.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
      title="Open series"
    >
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid var(--hp-border)",
          background: "var(--hp-card)",
          boxShadow: "var(--hp-shadow-card)",
          minHeight: 280,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 178,
            background: imgFailed
              ? "linear-gradient(180deg, rgba(124,108,255,0.16), rgba(124,108,255,0.05))"
              : "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.03))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {series.cover_url && !imgFailed ? (
            <img
              src={series.cover_url}
              alt={series.title}
              onError={() => setImgFailed(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--hp-muted)",
                letterSpacing: 0.2,
              }}
            >
              No cover yet
            </div>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--hp-muted)",
              marginBottom: 10,
            }}
          >
            Series
          </div>

          <div
            style={{
              fontWeight: 950,
              fontSize: 16,
              lineHeight: 1.25,
              textTransform: "uppercase",
            }}
          >
            {series.title}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "var(--hp-muted)",
              lineHeight: 1.45,
            }}
          >
            {series.description?.trim()
              ? truncateText(series.description, 70)
              : "Story collection"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function infoBoxStyle(): React.CSSProperties {
  return {
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    borderRadius: 18,
    padding: "18px 20px",
    color: "var(--hp-muted)",
    boxShadow: "var(--hp-shadow-card)",
    fontSize: 14,
  };
}

function softPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "rgba(255,255,255,0.72)",
    color: "var(--hp-text)",
    fontWeight: 700,
    fontSize: 14,
    whiteSpace: "nowrap",
    boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.18s ease",
  };
}