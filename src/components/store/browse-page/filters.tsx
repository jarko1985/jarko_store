import { FiltersQueryType } from "@/lib/types";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import CategoryFilter from "./filters/category/category-filter";
import OfferFilter from "./filters/offer/offer-filter";
import SizeFilter from "./filters/size/size-filter";
import FiltersHeader from "./filters/header";

export default async function ProductFilters({
  queries,
  storeUrl,
}: {
  queries: FiltersQueryType;
  storeUrl?: string;
}) {
  const { category, subCategory, offer } = queries;
  const categories = await getAllCategories(storeUrl);
  const offers = await getAllOfferTags(storeUrl);
  return (
    <div className="h-[840px] transition-transform overflow-auto pr-6 pb-2.5 flex-none basis-[196px] sticky top-0 overflow-x-hidden scrollbar">
      <FiltersHeader queries={queries} />
      {/* Filters */}
      <div className="border-t w-44">
        <CategoryFilter categories={categories} />
        <OfferFilter offers={offers} />
        <SizeFilter queries={queries} storeUrl={storeUrl} />
      </div>
    </div>
  );
}
