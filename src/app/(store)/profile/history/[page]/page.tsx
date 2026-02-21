import ProfileHistoryClient from "./profile-history-client";

export const dynamic = "force-dynamic";

export default function ProfileHistoryPage({
  params,
}: {
  params: { page: string };
}) {
  return <ProfileHistoryClient page={params.page} />;
}
