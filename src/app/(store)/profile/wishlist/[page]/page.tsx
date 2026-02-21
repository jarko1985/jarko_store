import WishlistContainer from "@/components/store/profile/wishlist/container";
import { getUserWishlist } from "@/queries/profile";

export default async function ProfileWishlistPage({
  params,
}: {
  params: { page: string };
}) {
  const page = Number(params.page);
  const wishlist_data = await getUserWishlist(page);
  const { wishlist, totalPages } = wishlist_data;
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <WishlistContainer
          products={wishlist}
          page={page}
          totalPages={totalPages}
        />
      ) : (
        <div>No products</div>
      )}
    </div>
  );
}
