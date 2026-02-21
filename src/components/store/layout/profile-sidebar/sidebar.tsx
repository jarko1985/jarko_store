"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const path = pathname.split("/profile/")[1];
  const path_trim = path ? path.split("/")[0] : null;
  return (
    <div>
      <div className="w-full p-4 text-xs text-[#999]">
        <span>
          <Link href="/">Home</Link>
          <span className="mx-2">&gt;</span>
        </span>
        <span>
          <Link href="/profile">Account</Link>
          {pathname !== "/profile" && <span className="mx-2">&gt;</span>}
        </span>
        {path && (
          <span>
            <Link href={pathname} className="capitalize">
              {path_trim || path}
            </Link>
          </span>
        )}
      </div>
      <div className="bg-white">
        <div className="py-3 inline-block w-[296px] min-h-72 mr-6">
          <div className="font-bold text-main-primary flex h-9 items-center px-4">
            <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              Account
            </div>
          </div>
          {/* Links */}
          {menu.map((item) => (
            <Link key={item.link} href={item.link}>
              <div
                className={cn(
                  "relative flex h-9 items-center text-sm px-4 cursor-pointer hover:bg-[#f5f5f5]",
                  {
                    "bg-[#f5f5f5] user-menu-item":
                      item.link &&
                      (pathname === item.link ||
                        (pathname.startsWith(item.link) &&
                          item.link !== "/profile")),
                  }
                )}
              >
                <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const menu = [
  {
    title: "Overview",
    link: "/profile",
  },
  {
    title: "Orders",
    link: "/profile/orders",
  },
  {
    title: "Payment",
    link: "/profile/payment",
  },
  {
    title: "Shipping address",
    link: "/profile/addresses",
  },
  {
    title: "Reviews",
    link: "/profile/reviews",
  },
  {
    title: "History",
    link: "/profile/history/1",
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist/1",
  },
  {
    title: "Following",
    link: "/profile/following/1",
  },
];
