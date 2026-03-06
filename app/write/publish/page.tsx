import PublishForm from "./PublishForm";
import { createClient } from "@/app/lib/supabase/server";

type Item = { id: string; name: string };
type SeriesItem = { id: string; title: string };

export default async function PublishPage(props: {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(props.searchParams ?? {});
  const raw = sp.postId;

  const postId =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] ?? "" : "";

  if (!postId) {
    return (
      <main className="hp-page" style={{ padding: "28px 16px" }}>
        <div
          className="hp-surface"
          style={{ maxWidth: 900, margin: "0 auto", padding: 18 }}
        >
          Missing postId.
        </div>
      </main>
    );
  }

  const supabase = await createClient();

  const [
    { data: categories, error: catErr },
    { data: series, error: serErr },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name")
      .is("parent_id", null)
      .order("name"),

    supabase.from("series").select("id,title").order("title"),
  ]);

  if (catErr) console.log("Categories error:", catErr.message);
  if (serErr) console.log("Series error:", serErr.message);

  return (
    <main className="hp-page" style={{ padding: "28px 16px" }}>
      <div
        className="hp-surface"
        style={{ maxWidth: 900, margin: "0 auto", padding: 18 }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
          Publish story
        </h1>
        <p className="hp-muted" style={{ marginBottom: 16 }}>
          Add category, subcategories, series, then publish.
        </p>

        <PublishForm
          postId={postId}
          categories={(categories ?? []) as Item[]}
          series={(series ?? []) as SeriesItem[]}
        />
      </div>
    </main>
  );
}