import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Block non sellers from accessing the seller dashboard
  const user = await currentUser();

  if (user?.publicMetadata.role !== "SELLER") redirect("/");
  return <div>{children}</div>;
}
