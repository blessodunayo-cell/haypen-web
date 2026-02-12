"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../app/lib/supabase";
import ProfileLayoutClient from "./ProfileLayoutClient";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio?: string | null;
};

export default function ProfilePageClient({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // show real diagnostics on the page
  const [debug, setDebug] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const normalizedSlug = (slug || "").trim().toLowerCase();

      // 1) Try to fetch the profile by username (case-insensitive)
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("id,username,display_name,bio")
        .ilike("username", normalizedSlug)
        .maybeSingle();

      // 2) Visibility check: can anon see ANY profiles?
      const { data: anyProfiles, error: anyErr } = await supabase
        .from("profiles")
        .select("username")
        .limit(5);

      // 3) Build debug string (so we see the REAL problem)
      const dbg = [
        `slug: "${slug}"`,
        `normalizedSlug: "${normalizedSlug}"`,
        `profErr: ${profErr ? profErr.message : "null"}`,
        `profFound: ${prof ? "YES" : "NO"}`,
        `anyErr: ${anyErr ? anyErr.message : "null"}`,
        `anyProfilesCount: ${anyProfiles ? anyProfiles.length : "null"}`,
        `anyProfiles: ${
          anyProfiles ? anyProfiles.map((p) => p.username).join(", ") : "null"
        }`,
      ].join("\n");

      setDebug(dbg);

      if (profErr || !prof) {
        setProfile(null);
        setIsOwner(false);
        setLoading(false);
        return;
      }

      setProfile(prof);

      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id ?? null;
      setIsOwner(userId === prof.id);

      setLoading(false);
    };

    run();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile…
      </div>
    );
  }

  // If profile isn't found, show debug info instead of a vague message
  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-lg font-semibold mb-3">
          Profile not found (debug)
        </div>
        <pre className="whitespace-pre-wrap text-sm opacity-80">{debug}</pre>
      </div>
    );
  }

  return <ProfileLayoutClient profile={profile} isOwner={isOwner} stories={[]} />;
}
