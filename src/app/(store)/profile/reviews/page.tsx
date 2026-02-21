import ReviewsContainer from "@/components/store/profile/reviews/reviews-container";
import { getUserReviews } from "@/queries/profile";

export default async function ProfileReviewsPage() {
  const reviews_data = await getUserReviews();
  const { reviews, totalPages } = reviews_data;
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your reviews</h1>
      <ReviewsContainer reviews={reviews} totalPages={totalPages} />
    </div>
  );
}
