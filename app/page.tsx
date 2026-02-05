import { stories } from "./data/stories";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-semibold tracking-tight">Haypen</div>
          <nav className="flex items-center gap-3">
            <a className="text-sm hover:underline" href="#">
              Explore
            </a>
            <a className="text-sm hover:underline" href="#">
              Write
            </a>
            <button className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
              Sign in
            </button>
            <button className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
              Get started
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              A home for stories. A place for writers.
            </h1>

            <p className="mt-4 max-w-2xl text-gray-600">
              Haypen is a clean, modern home for stories, chapters, and articles.
              Read, write, follow creators, and discover what’s trending.
            </p>

            <div className="mt-8 flex gap-3">
              <button className="rounded-full bg-black px-5 py-3 text-sm text-white hover:bg-gray-800">
                Start reading
              </button>
              <button className="rounded-full border px-5 py-3 text-sm hover:bg-gray-50">
                Become a writer
              </button>
            </div>

            <div className="mt-10 border-t pt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Trending</h2>
                <a className="text-sm text-gray-600 hover:underline" href="#">
                  See all
                </a>
              </div>

              <div className="grid gap-4">
                {stories.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-2xl border p-5 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border px-3 py-1 text-xs text-gray-700">
                        {p.tag}
                      </span>
                      <span className="text-xs text-gray-500">{p.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">by {p.author}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl border p-5">
                <h3 className="text-base font-semibold">Leaderboard</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Top writers this week.
                </p>
                <ol className="mt-4 space-y-3 text-sm">
                  {[
                    "Ayin X",
                    "Nadia Writes",
                    "Kemi Stories",
                    "Olu Prose",
                    "Zainab Ink",
                  ].map((name, i) => (
                    <li key={name} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {i + 1}. {name}
                      </span>
                      <span className="text-gray-500">⭐</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="text-base font-semibold">Start writing</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Create your channel and publish your first story in minutes.
                </p>
                <button className="mt-4 w-full rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Create a channel
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Haypen • Privacy • Terms
        </div>
      </footer>
    </main>
  );
}
