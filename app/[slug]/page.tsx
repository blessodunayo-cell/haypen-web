import ProfilePageClient from "../../components/profile/ProfilePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProfilePageClient slug={slug} />;
}
