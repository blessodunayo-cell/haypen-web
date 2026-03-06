"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CoverUpload({ name = "cover_url" }: { name?: string }) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPick(file: File | null) {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("post-covers")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from("post-covers").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">
        Cover image (optional)
      </label>

      <input type="hidden" name={name} value={url ?? ""} />

      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50">
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            disabled={uploading}
          />
        </label>

        {url ? (
          <span className="text-xs text-neutral-600">Uploaded ✅</span>
        ) : (
          <span className="text-xs text-neutral-500">PNG/JPG/WebP</span>
        )}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {/* Preview like “Facebook” */}
      {url ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}