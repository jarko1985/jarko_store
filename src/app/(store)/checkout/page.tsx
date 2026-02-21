import CheckoutContainer from "@/components/store/checkout-page/container";
import Header from "@/components/store/layout/header/header";
import { db } from "@/lib/db";
import { Country } from "@/lib/types";
import { getUserShippingAddresses } from "@/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) redirect("/cart");

  // Get user cart
  const cart = await db.cart.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: true,
      coupon: {
        include: {
          store: true,
        },
      },
    },
  });

  if (!cart) redirect("/cart");

  // Get user shipping address
  const addresses = await getUserShippingAddresses();

  // Get list of countries
  const countries = await db.country.findMany({
    orderBy: { name: "desc" },
  });

  // Get cookies from the store
  const cookieStore = cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  // Set default country if cookie is missing
  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  // If cookie exists, update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <>
      <Header />
      <div className="bg-[#f4f4f4] min-h-[calc(100vh-65px)]">
        <div className="max-w-container mx-auto py-5 px-2">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
            userCountry={userCountry}
          />
        </div>
      </div>
    </>
  );
}
