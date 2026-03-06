import { createDraftPost } from "./actions";
import CoverUpload from "./CoverUpload";

export default function WritePage() {
  return (
    <div className="min-h-screen bg-[#ebe6f7] px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Write a new story
          </h1>
          <p className="mt-1 text-gray-600">
            Start your draft. You'll choose category and publish next.
          </p>
        </div>

        {/* Writing Card */}
        <div className="rounded-3xl border border-gray-200 bg-[#f3f3f3] p-8 shadow-sm">

          <form action={createDraftPost} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>

              <input
                name="title"
                placeholder="Write your title…"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Story */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story
              </label>

              <textarea
                name="content"
                placeholder="Start writing your story here..."
                required
                className="w-full min-h-[360px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Cover Upload */}
            <CoverUpload name="cover_url" />

            {/* Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 text-white font-medium shadow-sm hover:opacity-95"
              >
                Continue
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}