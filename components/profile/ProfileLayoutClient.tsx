"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  followers_count?: number | null;
  following_count?: number | null;
  earnings?: number | null;
  monetized?: boolean | null;
  created_at?: string | null;
  stories_count?: number | null;
};

type Story = {
  id: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  cover_url?: string | null;
  created_at?: string | null;
  read_time?: number | null;
  earnings?: number | null;
};

export default function ProfileLayoutClient({
  profile,
  isOwner,
  stories,
}: {
  profile: Profile;
  isOwner: boolean;
  stories: Story[];
}) {
  const [activeTab, setActiveTab] = useState<"stories" | "about" | "earnings" | "settings">("stories");
  const storiesCount = useMemo(() => profile.stories_count ?? stories.length, [profile, stories]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied.");
    } catch {
      alert("Could not copy link.");
    }
  };

  const onStoryMenu = (story: Story) => {
    // For now simple prompt; next step we replace with proper dropdown/modal
    const action = prompt(`Story actions for: "${story.title}"\nType: edit | delete | view`);
    if (!action) return;

    if (action.toLowerCase() === "edit") {
      // You can route to your editor path, adjust later
      window.location.href = `/write?edit=${story.id}`;
    } else if (action.toLowerCase() === "delete") {
      alert("Next step: we’ll wire delete with Supabase + confirmation modal + RLS.");
    } else {
      window.location.href = `/story/${story.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="relative h-40 sm:h-56 w-full overflow-hidden bg-neutral-900">
        {profile.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.banner_url} alt="Banner" className="h-full w-full object-cover opacity-90" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900" />
        )}
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="relative -mt-10 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full border-4 border-black bg-neutral-800 overflow-hidden">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl font-semibold">
                  {profile.display_name?.slice(0, 1)?.toUpperCase() || "H"}
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {profile.display_name || "Creator"}
                </h1>

                {profile.monetized && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-700/40">
                    ✔ Monetized
                  </span>
                )}

                {/* Owner-only earnings badge */}
                {isOwner && (
                  <span className="text-xs px-2 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200">
                    $ Earnings
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-300">@{profile.username}</p>

              {profile.bio ? (
                <p className="mt-2 max-w-xl text-sm sm:text-base text-neutral-200">{profile.bio}</p>
              ) : null}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:pb-2">
            {isOwner ? (
              <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition">
                Edit profile
              </button>
            ) : (
              <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition">
                Follow
              </button>
            )}

            <button
              className="px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 transition"
              onClick={copyLink}
              title="Copy profile link"
            >
              Share
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-300">
          <Stat label="Stories" value={storiesCount} />
          <Stat label="Followers" value={profile.followers_count ?? 0} />
          <Stat label="Following" value={profile.following_count ?? 0} />

          {/* OWNER ONLY */}
          {isOwner && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-400">$</span>
              <span className="font-semibold text-white">Earnings</span>
              <span className="text-neutral-300">{Number(profile.earnings ?? 0).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-neutral-800 flex gap-6">
          <Tab active={activeTab === "stories"} onClick={() => setActiveTab("stories")}>Stories</Tab>
          <Tab active={activeTab === "about"} onClick={() => setActiveTab("about")}>About</Tab>

          {isOwner && (
            <>
              <Tab active={activeTab === "earnings"} onClick={() => setActiveTab("earnings")}>Earnings</Tab>
              <Tab active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>Settings</Tab>
            </>
          )}
        </div>

        {/* Content */}
        <div className="py-8">
          {activeTab === "stories" && (
            <div className="space-y-4">
              {stories.length === 0 ? (
                <div className="text-neutral-400">No stories yet.</div>
              ) : (
                stories.map((s) => (
                  <StoryRow key={s.id} story={s} isOwner={isOwner} onMenu={() => onStoryMenu(s)} />
                ))
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-2 text-neutral-200">{profile.bio || "This creator hasn’t added a bio yet."}</p>
              <p className="mt-4 text-sm text-neutral-400">
                Joined: {profile.created_at ? new Date(profile.created_at).toDateString() : "—"}
              </p>
            </div>
          )}

          {isOwner && activeTab === "earnings" && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <h2 className="text-lg font-semibold">Earnings</h2>
              <p className="mt-2 text-neutral-200">
                Total: ${Number(profile.earnings ?? 0).toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-neutral-400">
                Next: we’ll add “withdrawals”, “earnings by story”, and transparent history.
              </p>
            </div>
          )}

          {isOwner && activeTab === "settings" && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <div className="mt-3 text-sm text-neutral-300 space-y-2">
                <div>• Change display name</div>
                <div>• Change username</div>
                <div>• Update bio</div>
                <div>• Upload avatar</div>
                <div>• Upload banner</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
      <span className="font-semibold text-white">{value}</span>{" "}
      <span className="text-neutral-400">{label}</span>
    </div>
  );
}

function Tab({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-semibold transition ${
        active ? "text-white border-b-2 border-white" : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function StoryRow({ story, isOwner, onMenu }: { story: any; isOwner: boolean; onMenu: () => void }) {
  return (
    <div className="flex gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="w-24 h-20 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
        {story.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.cover_url} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              <Link href={`/story/${story.id}`} className="hover:underline">
                {story.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
              {story.excerpt || story.content?.slice(0, 120) || ""}
            </p>
          </div>

          {isOwner && (
            <button
              className="px-2 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition"
              onClick={onMenu}
              title="Story actions"
            >
              ⋮
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-neutral-400 flex gap-2">
          <span>{story.created_at ? new Date(story.created_at).toDateString() : ""}</span>
          {story.read_time ? <span>• {story.read_time} min read</span> : null}
          {isOwner ? <span className="ml-auto">${Number(story.earnings ?? 0).toFixed(2)}</span> : null}
        </div>
      </div>
    </div>
  );
}
