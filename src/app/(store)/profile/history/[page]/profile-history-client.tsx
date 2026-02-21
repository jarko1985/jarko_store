"use client";

import Pagination from "@/components/store/shared/pagination";
import ProductList from "@/components/store/shared/product-list";
import { getProductsByIds } from "@/queries/product";
import { useEffect, useState } from "react";

export default function ProfileHistoryClient({
  page: pageParam,
}: {
  page: string;
}) {
  const [products, setProducts] = useState<any>([]);
  const [page, setPage] = useState<number>(Number(pageParam) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const historyString = localStorage.getItem("productHistory");
      if (!historyString) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const productHistory = JSON.parse(historyString);
        const pageNum = Number(pageParam);
        const res = await getProductsByIds(productHistory, pageNum);
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Error fetching product history:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [pageParam]);

  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your product view history</h1>
      {loading ? (
        <div>loading...</div>
      ) : products.length > 0 ? (
        <div className="pb-16">
          <ProductList products={products} />
          <div className="mt-2">
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </div>
      ) : (
        <div>No products</div>
      )}
    </div>
  );
}
