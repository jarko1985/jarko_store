import ProductFilters from "@/components/store/browse-page/filters";
import ProductSort from "@/components/store/browse-page/sort";
import Header from "@/components/store/layout/header/header";
import ProductList from "@/components/store/shared/product-list";
import { FiltersQueryType } from "@/lib/types";
import { getProducts } from "@/queries/product";
import { getFilteredSizes } from "@/queries/size";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: FiltersQueryType;
}) {
  const { category, offer, search, size, sort, subCategory } = searchParams;
  await getFilteredSizes({});
  const products_data = await getProducts(
    {
      search,
      category,
      subCategory,
      offer,
      size: Array.isArray(size)
        ? size
        : size
        ? [size] // Convert single size string to array
        : undefined, // If no size, keep it undefined
    },
    sort
  );
  const { products } = products_data;

  return (
    <>
      <Header />
      <div className="max-w-[95%] mx-auto">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searchParams} />
          <div className="p-4 space-y-5">
            <ProductSort />
            {/* Product list */}
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </>
  );
}
