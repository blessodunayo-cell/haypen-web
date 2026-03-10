"use client";

import { useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateSeriesPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const previewSlug = useMemo(() => makeSlug(title || "my-series"), [title]);

  async function handleCreateSeries(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter a series title.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please enter a series description.");
      return;
    }

    if (!coverFile) {
      setErrorMsg("Please upload a cover image.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg("You must be signed in to create a series.");
        setSubmitting(false);
        return;
      }

      let finalSlug = makeSlug(title);
      if (!finalSlug) finalSlug = `series-${Date.now()}`;

      const { data: existingSlug } = await supabase
        .from("series")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }

      let uploadedCoverUrl: string | null = null;

      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("series-covers")
          .upload(fileName, coverFile);

        if (uploadError) {
          setErrorMsg(uploadError.message || "Cover image upload failed.");
          setSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("series-covers")
          .getPublicUrl(uploadData.path);

        uploadedCoverUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("series").insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        cover_url: uploadedCoverUrl,
        slug: finalSlug,
        is_public: isPublic,
        is_active: true,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to create series.");
        setSubmitting(false);
        return;
      }

      setSuccessMsg("Series created successfully.");

      setTimeout(() => {
        router.push("/dashboard/my-series");
      }, 800);
    } catch (error) {
      setErrorMsg("Something went wrong while creating the series.");
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
          onClick={() => router.push("/dashboard/my-series")}
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
          padding: "28px 90px 48px",
        }}
      >
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
            margin: "14px 0 10px",
            fontSize: 30,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Create a new series
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Give your story collection a title, description, and cover.
        </p>

        <form
          onSubmit={handleCreateSeries}
          style={{
            marginTop: 28,
            maxWidth: 760,
            background: "#ffffff",
            border: "1px solid #ddd6fe",
            borderRadius: 22,
            padding: 24,
            boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
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
                Series title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
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
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description of your series..."
                rows={5}
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #d8d4e8",
                  background: "#fcfbff",
                  padding: "12px 14px",
                  fontSize: 15,
                  color: "#111827",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
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
                Upload cover image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;
                  setCoverFile(e.target.files[0]);
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

              {coverFile ? (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Selected: {coverFile.name}
                </div>
              ) : null}
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make this series public
              </label>
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
                  color: "#7c6cff",
                }}
              >
                {previewSlug}
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

            {successMsg ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {successMsg}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                onClick={() => router.push("/dashboard/my-series")}
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
                {submitting ? "Creating..." : "Create Series"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}