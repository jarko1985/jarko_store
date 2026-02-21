"use client";
import { FiltersQueryType, ProductType } from "@/lib/types";
import { getProducts } from "@/queries/product";
import { useEffect, useState } from "react";
import ProductCard from "../cards/product/product-card";

export default function StoreProducts({
  searchParams,
  store,
}: {
  searchParams: FiltersQueryType;
  store: string;
}) {
  const [data, setData] = useState<ProductType[]>([]);
  const { category, offer, search, size, sort, subCategory } = searchParams;

  useEffect(() => {
    const getFilteredProducts = async () => {
      const { products } = await getProducts(
        {
          category,
          offer,
          search,
          size: Array.isArray(size) ? size : size ? [size] : undefined,
          subCategory,
          store,
        },
        sort,
        1,
        100
      );
      setData(products);
    };
    getFilteredProducts();
  }, [searchParams]);
  return (
    <div className=" bg-white justify-center md:justify-start flex flex-wrap p-2 pb-16 rounded-md">
      {data.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
