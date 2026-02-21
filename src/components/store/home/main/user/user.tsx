import { SimpleProduct } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import UserImg from "@/public/assets/images/default-user.avif";
import Link from "next/link";
import { Button } from "../../../ui/button";
import MainSwiper from "../../../shared/swiper";
import UserCardProducts from "./products";

export default async function HomeUserCard({
  products,
}: {
  products: SimpleProduct[];
}) {
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  return (
    <div className="h-full hidden min-[1170px]:block relative bg-white rounded-md shadow-sm overflow-hidden">
      <div
        className="h-full rounded-md bg-no-repeat pb-9"
        style={{
          backgroundImage: "url(/assets/images/user-card-bg.avif)",
          backgroundSize: "100% 101px",
        }}
      >
        {/*User info */}
        <div className="w-full h-[76px]">
          <div className="mx-auto cursor-pointer">
            <Image
              src={user ? user.imageUrl : UserImg}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover absolute left-1/2 -translate-x-1/2 top-2"
            />
          </div>
          <div className="absolute top-16 w-full h-5 font-bold text-black text-center cursor-pointer capitalize">
            {user ? user.fullName?.toLowerCase() : "Welcome to GoShop"}
          </div>
        </div>
        {/* User links */}
        <div className="w-full h-[100px] flex items-center gap-x-4 justify-center mt-4">
          <Link href="/profile">
            <span
              className="relative block w-12 h-12 mx-auto bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/user.webp)",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center">
              Account
            </span>
          </Link>
          <Link href="/profile/orders">
            <span
              className="relative block w-12 h-12 mx-auto bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/orders.webp)",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center pl-1">
              Orders
            </span>
          </Link>
          <Link href="/profile/wishlist">
            <span
              className="relative block w-12 h-12 mx-auto bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/wishlist.png)",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center">
              Wishlist
            </span>
          </Link>
        </div>
        {/* Action btn */}
        <div className="w-full px-2">
          {user ? (
            <div className="w-full">
              {role === "ADMIN" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/admin"}>
                    Switch to Admin Dashboard
                  </Link>
                </Button>
              ) : role === "SELLER" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/seller"}>
                    Switch to Seller Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/seller/apply"}>Apply to become a seller</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-between gap-x-4">
              <Button variant="orange-gradient">
                <Link href="/sign-up">Join</Link>
              </Button>
              <Button variant="gray">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          )}
        </div>
        {/* Ad swiper */}
        <div className="w-full h-full flex-1 px-2 max-h-[420px] pb-[102px] mt-2">
          <div
            className="w-full h-full px-2.5 bg-[#f5f5f5] bg-cover rounded-md overflow-hidden"
            style={{
              backgroundImage: "url(/assets/images/ads/user-card-ad.avif)",
            }}
          >
            <Link href="">
              <div className="h-24">
                <div className="mt-2.5 text-white leading-[18px] text-[13px] overflow-hidden">
                  Your favorite store
                </div>
                <div className="leading-5 font-bold mt-2.5 text-white">
                  Check out the latest new deals
                </div>
              </div>
            </Link>
            <UserCardProducts products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
