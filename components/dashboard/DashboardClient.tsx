"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../app/lib/supabase";
import Link from "next/link";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio?: string | null;
};

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<"stories" | "drafts" | "earnings" | "settings">(
    "stories"
  );

  // small debug string (optional but helpful)
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrMsg("");

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      const user = userRes?.user ?? null;

      if (userErr) {
        console.log("getUser error:", userErr);
      }

      // Not logged in → go to /login
      if (!user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      // 1) Try normal fetch by id
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("id,username,display_name,bio")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && prof) {
        setProfile(prof);
        setLoading(false);
        return;
      }

      // Log the REAL issue
      if (error) {
        console.log("Profile fetch error:", error);
        setErrMsg(error.message || "Profile fetch failed.");
      } else {
        setErrMsg("Profile row not found for this user.");
      }

      // 2) Fallback: if maybeSingle complains about multiple rows,
      // fetch the first row instead of failing.
      const maybeMultiple =
        (error?.message || "").toLowerCase().includes("multiple") ||
        (error?.message || "").toLowerCase().includes("coerce");

      if (maybeMultiple) {
        const { data: list, error: listErr } = await supabase
          .from("profiles")
          .select("id,username,display_name,bio")
          .eq("id", user.id)
          .limit(1);

        if (listErr) {
          console.log("Fallback list fetch error:", listErr);
          setErrMsg(listErr.message || "Fallback fetch failed.");
          setProfile(null);
          setLoading(false);
          return;
        }

        const first = list?.[0] ?? null;
        setProfile(first);
        setLoading(false);
        return;
      }

      // If we got here, profile truly isn't usable yet
      setProfile(null);
      setLoading(false);
    };

    run();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
        <div>
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="mt-2 text-neutral-300">
            We couldn’t load your profile data yet.
          </div>

          {/* show the actual error (temporary) */}
          {errMsg ? (
            <div className="mt-3 text-sm text-neutral-400 whitespace-pre-wrap">
              {errMsg}
            </div>
          ) : null}

          <div className="mt-4">
            <button
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold"
              onClick={() => router.push("/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-neutral-300 mt-1">
              {profile.display_name} •{" "}
              <Link className="underline" href={`/${profile.username}`}>
                @{profile.username}
              </Link>
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/write"
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition"
            >
              Write
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-900 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 border-b border-neutral-800 flex gap-6">
          <Tab active={tab === "stories"} onClick={() => setTab("stories")}>
            My Stories
          </Tab>
          <Tab active={tab === "drafts"} onClick={() => setTab("drafts")}>
            Drafts
          </Tab>
          <Tab active={tab === "earnings"} onClick={() => setTab("earnings")}>
            Earnings
          </Tab>
          <Tab active={tab === "settings"} onClick={() => setTab("settings")}>
            Settings
          </Tab>
        </div>

        <div className="py-8">
          {tab === "stories" && (
            <Card title="My Stories">
              <p className="text-neutral-300">
                No stories yet. Click “Write” to publish your first story.
              </p>
            </Card>
          )}

          {tab === "drafts" && (
            <Card title="Drafts">
              <p className="text-neutral-300">No drafts yet.</p>
            </Card>
          )}

          {tab === "earnings" && (
            <Card title="Earnings">
              <p className="text-neutral-300">
                Coming soon. This will show your revenue and payout history.
              </p>
            </Card>
          )}

          {tab === "settings" && (
            <Card title="Profile Settings">
              <div className="space-y-3 text-neutral-200">
                <div>
                  <span className="text-neutral-400">Display name:</span>{" "}
                  {profile.display_name}
                </div>
                <div>
                  <span className="text-neutral-400">Username:</span> @
                  {profile.username}
                </div>
                <div>
                  <span className="text-neutral-400">Bio:</span>{" "}
                  {profile.bio || "—"}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-semibold transition ${
        active
          ? "text-white border-b-2 border-white"
          : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
