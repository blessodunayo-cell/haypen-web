import { supabase } from "../lib/supabase";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const username = decodeURIComponent(slug).toLowerCase();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, username, bio, website, avatar_url")
    .eq("username", username)
    .single();

  return (
    <main style={{ padding: 30 }}>
      <h1>Profile</h1>
      <p style={{ opacity: 0.8 }}>@{username}</p>

      {error ? (
        <pre style={{ marginTop: 20 }}>{JSON.stringify(error, null, 2)}</pre>
      ) : null}

      {data ? (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ margin: 0 }}>{data.display_name ?? username}</h2>

          {data.bio ? <p style={{ marginTop: 10 }}>{data.bio}</p> : null}

          {data.website ? (
            <p style={{ marginTop: 10 }}>
              <a href={data.website} target="_blank" rel="noreferrer">
                {data.website}
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
