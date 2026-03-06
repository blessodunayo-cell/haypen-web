import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json([], { status: 200 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name")
    .eq("parent_id", categoryId)
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data ?? []);
}