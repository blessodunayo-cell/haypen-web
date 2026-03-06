"use client";

import { useEffect, useState } from "react";
import { publishPost } from "../actions";

type Item = { id: string; name: string };
type SeriesItem = { id: string; title: string };

export default function PublishForm({
  postId,
  categories,
  series,
}: {
  postId: string;
  categories: Item[];
  series: SeriesItem[];
}) {
  const [categoryId, setCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState<Item[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [seriesChoice, setSeriesChoice] = useState<"no" | "yes">("no");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      setLoadingSubs(true);
      try {
        const res = await fetch(`/api/subcategories?categoryId=${categoryId}`);
        const data = await res.json();
        if (!cancelled) setSubcategories(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoadingSubs(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return (
    <form action={publishPost} className="space-y-6">
      <input type="hidden" name="postId" value={postId} />

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-purple-400"
          required
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subcategories
        </label>

        <div className="rounded-xl border border-gray-300 bg-white p-4">
          {!categoryId ? (
            <p className="text-sm text-gray-500">Pick a category first.</p>
          ) : loadingSubs ? (
            <p className="text-sm text-gray-500">Loading subcategories…</p>
          ) : subcategories.length === 0 ? (
            <p className="text-sm text-gray-500">No subcategories found.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sc) => (
                <label
                  key={sc.id}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  <input type="checkbox" name="subcategoryIds" value={sc.id} />
                  {sc.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI involved */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI involved in your writing?
        </label>

        <div className="flex gap-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="aiInvolved" value="no" defaultChecked />
            No
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="aiInvolved" value="yes" />
            Yes
          </label>
        </div>
      </div>

      {/* Series */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is this part of a series?
        </label>

        <div className="flex gap-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="seriesChoice"
              value="no"
              checked={seriesChoice === "no"}
              onChange={() => setSeriesChoice("no")}
            />
            No
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="seriesChoice"
              value="yes"
              checked={seriesChoice === "yes"}
              onChange={() => setSeriesChoice("yes")}
            />
            Yes
          </label>
        </div>

        {seriesChoice === "yes" ? (
          <div className="mt-3">
            <select
              name="seriesId"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none"
              defaultValue=""
              required
            >
              <option value="">Select a series…</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Next: we’ll add “Create new series” here.
            </p>
          </div>
        ) : null}
      </div>

      {/* Publish */}
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 text-white font-medium shadow-sm hover:opacity-95"
      >
        Publish
      </button>
    </form>
  );
}