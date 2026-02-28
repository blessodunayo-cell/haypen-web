import { stories } from "./data/stories";

export default function Home() {
  const purpleBtn: React.CSSProperties = {
    background: "linear-gradient(135deg, #7C6AF2, #6A5AE0)",
    color: "#fff",
  };

  return (
    <main className="min-h-screen text-gray-900" style={{ background: "#EEEAF7" }}>
      <header className="border-b border-black/10 bg-[rgba(238,234,247,0.75)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-semibold tracking-tight">Haypen</div>

          <nav className="flex items-center gap-3">
            <a className="text-sm hover:underline" href="/explore">
              Explore
            </a>

            <a className="text-sm hover:underline" href="/write">
              Write
            </a>

            <a
              className="rounded-full border px-4 py-2 text-sm hover:bg-black/5"
              href="/login"
            >
              Sign in
            </a>

            {/* ✅ lavender primary */}
            <a
              className="rounded-full px-4 py-2 text-sm text-white"
              style={purpleBtn}
              href="/signup"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              A home for stories. A place for writers.
            </h1>

            <p className="mt-4 max-w-2xl text-gray-700">
              Haypen is a clean, modern home for stories, chapters, and articles.
              Read, write, follow creators, and discover what’s trending.
            </p>

            <div className="mt-8 flex gap-3">
              {/* ✅ lavender primary */}
              <a
                className="rounded-full px-5 py-3 text-sm text-white"
                style={purpleBtn}
                href="/explore"
              >
                Start reading
              </a>

              <a
                className="rounded-full border px-5 py-3 text-sm hover:bg-black/5"
                href="/signup"
              >
                Become a writer
              </a>
            </div>

            <div className="mt-10 border-t border-black/10 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Trending</h2>
                <a className="text-sm text-gray-700 hover:underline" href="/explore">
                  See all
                </a>
              </div>

              <div className="grid gap-4">
                {stories.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-gray-700">
                        {p.tag}
                      </span>
                      <span className="text-xs text-gray-600">{p.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-700">by {p.author}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-base font-semibold">Leaderboard</h3>
                <p className="mt-1 text-sm text-gray-700">Top writers this week.</p>
                <ol className="mt-4 space-y-3 text-sm">
                  {["Ayin X", "Nadia Writes", "Kemi Stories", "Olu Prose", "Zainab Ink"].map(
                    (name, i) => (
                      <li key={name} className="flex items-center justify-between">
                        <span className="text-gray-800">
                          {i + 1}. {name}
                        </span>
                        <span className="text-gray-600">⭐</span>
                      </li>
                    )
                  )}
                </ol>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-base font-semibold">Start writing</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Create your channel and publish your first story in minutes.
                </p>

                {/* ✅ lavender primary */}
                <a
                  className="mt-4 block w-full rounded-full px-4 py-2 text-center text-sm text-white"
                  style={purpleBtn}
                  href="/login"
                >
                  Create a channel
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Haypen • Privacy • Terms
        </div>
      </footer>
    </main>
  );
}