import { ReactNode } from "react";
import Header from "@/components/store/layout/header/header";
import ProfileSidebar from "@/components/store/layout/profile-sidebar/sidebar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="max-w-container mx-auto flex gap-4 p-4">
        <ProfileSidebar />
        <div className="w-full mt-12">{children}</div>
      </div>
    </div>
  );
}
