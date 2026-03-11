"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";

type SeriesData = {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  cover_url: string | null;
};

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function WriteSeriesChapterPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [series, setSeries] = useState<SeriesData | null>(null);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiInvolved, setAiInvolved] = useState(false);
  const [chapterCoverFile, setChapterCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const previewSlug = useMemo(() => {
    return title.trim() ? makeSlug(title) : "";
  }, [title]);

  useEffect(() => {
    async function fetchSeries() {
      if (!slug) return;

      setLoadingSeries(true);
      setErrorMsg("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("series")
        .select("id, title, slug, author_id, cover_url")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setErrorMsg("Series not found.");
        setLoadingSeries(false);
        return;
      }

      if (!user || user.id !== data.author_id) {
        setErrorMsg("You can only add chapters to your own series.");
        setLoadingSeries(false);
        return;
      }

      setSeries(data);
      setLoadingSeries(false);
    }

    fetchSeries();
  }, [slug, supabase]);

  async function handlePublishChapter(e: React.FormEvent) {
    e.preventDefault();

    if (!series) {
      setErrorMsg("Series not found.");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Please enter a chapter title.");
      return;
    }

    if (!content.trim()) {
      setErrorMsg("Please write your chapter content.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg("You must be signed in to publish a chapter.");
        setSubmitting(false);
        return;
      }

      let finalSlug = makeSlug(title);
      if (!finalSlug) finalSlug = `chapter-${Date.now()}`;

      const { data: existingSlug } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }

      let uploadedChapterCoverUrl: string | null = null;

      if (chapterCoverFile) {
        const fileExt = chapterCoverFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("post-covers")
          .upload(fileName, chapterCoverFile);

        if (uploadError) {
          setErrorMsg(uploadError.message || "Chapter cover upload failed.");
          setSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("post-covers")
          .getPublicUrl(uploadData.path);

        uploadedChapterCoverUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("posts").insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        slug: finalSlug,
        cover_url: uploadedChapterCoverUrl,
        ai_involved: aiInvolved,
        series_id: series.id,
        category_id: null,
        published_at: new Date().toISOString(),
      });

      if (insertError) {
        setErrorMsg(insertError.message || "Failed to publish chapter.");
        setSubmitting(false);
        return;
      }

      router.push(`/series/${series.slug}`);
    } catch (error) {
      setErrorMsg("Something went wrong while publishing the chapter.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3efff",
      }}
    >
      <div
        style={{
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid #ddd6fe",
          background: "#f3efff",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Haypen
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid #ddd6fe",
            background: "#ffffff",
            color: "#111827",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(17, 24, 39, 0.04)",
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          <span>Back</span>
        </button>
      </div>

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "28px 24px 50px",
        }}
      >
        {loadingSeries ? (
          <p
            style={{
              fontSize: 15,
              color: "#6b7280",
            }}
          >
            Loading series...
          </p>
        ) : errorMsg && !series ? (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        ) : series ? (
          <>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#6b7280",
              }}
            >
              Series
            </p>

            <h1
              style={{
                margin: "12px 0 8px",
                fontSize: 34,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              Write a new chapter
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "#4b5563",
              }}
            >
              This chapter will be published under{" "}
              <span style={{ fontWeight: 800, color: "#111827" }}>
                {series.title}
              </span>
              .
            </p>

            <form
              onSubmit={handlePublishChapter}
              style={{
                marginTop: 24,
                background: "#ffffff",
                border: "1px solid #ddd6fe",
                borderRadius: 22,
                padding: 24,
                boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)",
                display: "grid",
                gap: 18,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Chapter title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "1px solid #d8d4e8",
                    background: "#fcfbff",
                    padding: "0 14px",
                    fontSize: 15,
                    color: "#111827",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#faf8ff",
                  border: "1px solid #ece7ff",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 4,
                  }}
                >
                  Preview slug
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: previewSlug ? "#7c6cff" : "#9ca3af",
                  }}
                >
                  {previewSlug || "Your chapter slug will appear here"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Chapter content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  placeholder="Write your chapter here..."
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid #d8d4e8",
                    background: "#fcfbff",
                    padding: "14px",
                    fontSize: 15,
                    color: "#111827",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: 1.7,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Optional chapter cover image
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;
                    setChapterCoverFile(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: 46,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: "1px solid #d8d4e8",
                    background: "#fcfbff",
                    color: "#111827",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Choose File
                </button>

                {chapterCoverFile ? (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    Selected: {chapterCoverFile.name}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  AI involved in writing this chapter?
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    minHeight: 48,
                    padding: "0 14px",
                    borderRadius: 14,
                    border: "1px solid #d8d4e8",
                    background: "#fcfbff",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 15,
                      color: "#111827",
                    }}
                  >
                    <input
                      type="radio"
                      checked={!aiInvolved}
                      onChange={() => setAiInvolved(false)}
                    />
                    No
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 15,
                      color: "#111827",
                    }}
                  >
                    <input
                      type="radio"
                      checked={aiInvolved}
                      onChange={() => setAiInvolved(true)}
                    />
                    Yes
                  </label>
                </div>
              </div>

              {errorMsg ? (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    color: "#be123c",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {errorMsg}
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push(`/series/${series.slug}`)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid #d8d4e8",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid #8b7cf6",
                    background: "#8b7cf6",
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Publishing..." : "Publish Chapter"}
                </button>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}