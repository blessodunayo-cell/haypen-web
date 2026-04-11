"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type CategoryItem = {
  id: string;
  name: string;
  parent_id: string | null;
};

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

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const previewSlug = useMemo(() => {
    return title.trim() ? makeSlug(title) : "";
  }, [title]);

  const parentCategories = useMemo(
    () => categories.filter((item) => item.parent_id === null),
    [categories]
  );

  const childSubcategories = useMemo(
    () => categories.filter((item) => item.parent_id === categoryId),
    [categories, categoryId]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        setLoadingMeta(true);
        setErrorMsg("");

        const { data, error } = await supabase
          .from("categories")
          .select("id, name, parent_id")
          .order("name");

        if (error) {
          if (isMounted) {
            setErrorMsg("Failed to load categories.");
          }
          return;
        }

        if (isMounted) {
          setCategories(data ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMsg("Failed to load categories.");
        }
      } finally {
        if (isMounted) {
          setLoadingMeta(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

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

    if (!categoryId) {
      setErrorMsg("Please choose a category.");
      return;
    }

    if (selectedSubcategories.length === 0) {
      setErrorMsg("Please choose at least one subcategory.");
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
        router.replace("/login");
        return;
      }

      let finalSlug = makeSlug(title);
      if (!finalSlug) finalSlug = `series-${Date.now()}`;

      const { data: existingSlug, error: existingSlugError } = await supabase
        .from("series")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existingSlugError) {
        setErrorMsg(existingSlugError.message || "Failed to validate series slug.");
        return;
      }

      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }

      const fileExt = coverFile.name.split(".").pop() || "jpg";
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("series-covers")
        .upload(fileName, coverFile);

      if (uploadError) {
        setErrorMsg(uploadError.message || "Cover image upload failed.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("series-covers")
        .getPublicUrl(uploadData.path);

      const uploadedCoverUrl = publicUrlData.publicUrl;

      const { data: createdSeries, error: createError } = await supabase
        .from("series")
        .insert({
          author_id: user.id,
          title: title.trim(),
          description: description.trim(),
          cover_url: uploadedCoverUrl,
          slug: finalSlug,
          is_public: isPublic,
          is_active: true,
          category_id: categoryId,
        })
        .select("id")
        .single();

      if (createError || !createdSeries) {
        setErrorMsg(createError?.message || "Failed to create series.");
        return;
      }

      const subcategoryRows = selectedSubcategories.map((subcategoryId) => ({
        series_id: createdSeries.id,
        subcategory_id: subcategoryId,
      }));

      const { error: subcatError } = await supabase
        .from("series_subcategories")
        .insert(subcategoryRows);

      if (subcatError) {
        setErrorMsg(
          subcatError.message || "Failed to save series subcategories."
        );
        return;
      }

      setSuccessMsg("Series created successfully.");

      setTimeout(() => {
        router.push("/dashboard/my-series");
      }, 800);
    } catch (error) {
      setErrorMsg("Something went wrong while creating the series.");
    } finally {
      setSubmitting(false);
    }
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
          Give your story collection a title, description, cover, category, and
          subcategories.
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
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSelectedSubcategories([]);
                }}
                disabled={loadingMeta}
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
              >
                <option value="">Select a category...</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                Subcategories
              </label>

              <div
                style={{
                  minHeight: 72,
                  borderRadius: 14,
                  border: "1px solid #d8d4e8",
                  background: "#fcfbff",
                  padding: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                {!categoryId ? (
                  <div
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                    }}
                  >
                    Pick a category first
                  </div>
                ) : childSubcategories.length === 0 ? (
                  <div
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                    }}
                  >
                    No subcategories found for this category.
                  </div>
                ) : (
                  childSubcategories.map((sub) => {
                    const checked = selectedSubcategories.includes(sub.id);

                    return (
                      <label
                        key={sub.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 14px",
                          borderRadius: 999,
                          border: checked
                            ? "1px solid #8b7cf6"
                            : "1px solid #d8d4e8",
                          background: checked ? "#f3efff" : "#ffffff",
                          cursor: "pointer",
                          fontSize: 14,
                          color: "#111827",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedSubcategories((prev) =>
                              checked
                                ? prev.filter((id) => id !== sub.id)
                                : [...prev, sub.id]
                            );
                          }}
                        />
                        {sub.name}
                      </label>
                    );
                  })
                )}
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
                  color: previewSlug ? "#7c6cff" : "#9ca3af",
                }}
              >
                {previewSlug || "Your series slug will appear here"}
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
                disabled={submitting || loadingMeta}
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid #8b7cf6",
                  background: "#8b7cf6",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor:
                    submitting || loadingMeta ? "not-allowed" : "pointer",
                  opacity: submitting || loadingMeta ? 0.7 : 1,
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