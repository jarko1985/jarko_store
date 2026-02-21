import StoreCard from "@/components/store/cards/store-card";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Header from "@/components/store/layout/header/header";
import ProductPageContainer from "@/components/store/product-page/container";
import ProductDescription from "@/components/store/product-page/product-description";
import ProductQuestions from "@/components/store/product-page/product-questions";
import ProductSpecs from "@/components/store/product-page/product-specs";
import RelatedProducts from "@/components/store/product-page/related-product";
import ProductReviews from "@/components/store/product-page/reviews/product-reviews";
import StoreProducts from "@/components/store/product-page/store-products";
import { Separator } from "@/components/ui/separator";
import { getProductPageData, getProducts } from "@/queries/product";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId },
}: PageProps) {
  // Fetch product data based on the product slug and variant slug
  const productData = await getProductPageData(productSlug, variantSlug);

  // If no product data is found, show the 404 Not Found page
  if (!productData) {
    return notFound();
    //return redirect("/");
  }

  // Extract the available sizes for the product variant
  const { sizes } = productData;

  // If the size is provided in the URL
  if (sizeId) {
    // Check if the provided sizeId is valid by comparing with available sizes
    const isValidSize = sizes.some((size) => size.id === sizeId);

    // If the sizeId is not valid, redirect to the same product page without the size parameter
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  }
  // If no sizeId is provided and there's only one size available, automatically select it
  else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0].id}` // Redirect to the URL with the size parameter prefilled
    );
  }

  const {
    productId,
    variantInfo,
    specs,
    questions,
    category,
    store,
    reviewsStatistics,
    reviews,
  } = productData;

  const relatedProducts = await getProducts(
    { category: category.url },
    "",
    1,
    12
  );

  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related products */}
              <RelatedProducts products={relatedProducts.products} />
            </>
          )}
          <Separator className="mt-6" />
          {/* Product reviews */}
          <ProductReviews
            productId={productData.productId}
            rating={productData.rating}
            statistics={reviewsStatistics}
            reviews={reviews}
            variantsInfo={variantInfo}
          />
          <>
            <Separator className="mt-6" />
            {/* Product description */}
            <ProductDescription
              text={[
                productData.description,
                productData.variantDescription || "",
              ]}
            />
          </>
          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs table */}
              <ProductSpecs specs={specs} />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              <ProductQuestions questions={productData.questions} />
            </>
          )}
          <Separator className="my-6" />
          {/* Store card */}
          <StoreCard store={productData.store} />
          {/* Store products */}
          <StoreProducts
            storeUrl={store.url}
            storeName={store.name}
            count={5}
          />
        </ProductPageContainer>
      </div>
    </div>
  );
}
