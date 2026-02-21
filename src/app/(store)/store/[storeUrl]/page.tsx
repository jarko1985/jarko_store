import ProductFilters from "@/components/store/browse-page/filters";
import ProductSort from "@/components/store/browse-page/sort";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Header from "@/components/store/layout/header/header";
import StoreDEetails from "@/components/store/store-page/store-details";
import StoreProducts from "@/components/store/store-page/store-products";
import { FiltersQueryType } from "@/lib/types";
import { getStorePageDetails } from "@/queries/store";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeUrl: string };
  searchParams: FiltersQueryType;
}) {
  const store = await getStorePageDetails(params.storeUrl);
  return (
    <>
      <Header />
      <CategoriesHeader />
      <StoreDEetails details={store} />
      <div className="max-w-[95%] mx-auto border-t">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searchParams} storeUrl={params.storeUrl} />
          <div className="p-4 space-y-5">
            <ProductSort />
            <StoreProducts
              searchParams={searchParams}
              store={params.storeUrl}
            />
          </div>
        </div>
      </div>
    </>
  );
}
