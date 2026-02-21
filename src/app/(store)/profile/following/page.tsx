import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ProfileFollowingPage() {
  redirect("/profile/following/1");
}
