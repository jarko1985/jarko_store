import { CatgegoryWithSubsType } from "@/lib/types";
import { Minus, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CategoryLink({
  category,
}: {
  category: CatgegoryWithSubsType;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const pathname = usePathname();

  const { replace } = useRouter();

  // Params
  const categoryQuery = searchParams.get("category");
  const subCategoryQuery = searchParams.get("subCategory");

  const [expand, setExpand] = useState<boolean>(false);

  const handleCategoryChange = (category: string) => {
    if (category === categoryQuery) return;
    params.delete("subCategory");
    params.set("category", category);
    replaceParams();
  };

  const handleSubCategoryChange = (sub: string) => {
    if (category.url !== categoryQuery) params.set("category", category.url);
    if (sub === subCategoryQuery) {
      params.delete("subCategory");
    } else {
      params.set("subCategory", sub);
    }
    replaceParams();
  };

  const replaceParams = () => {
    replace(`${pathname}?${params.toString()}`);
    setExpand(true);
  };
  return (
    <div>
      <section>
        <div className="mt-2 leading-5 relative w-full flex items-center justify-between">
          <label
            htmlFor={category.id}
            className="flex items-center text-left cursor-pointer whitespace-nowrap select-none"
            onClick={() => handleCategoryChange(category.url)}
          >
            <span className="mr-2 border border-[#ccc] w-3 h-3 rounded-full relative grid place-items-center">
              {category.url === categoryQuery && (
                <div className="h-1.5 w-1.5 inline-block bg-black rounded-full"></div>
              )}
            </span>
            <div className="flex-1 text-xs inline-block overflow-visible text-clip whitespace-normal">
              {category.name}
            </div>
          </label>
          <span
            className="cursor-pointer"
            onClick={() => setExpand((prev) => !prev)}
          >
            {expand ? <Minus className="w-3" /> : <Plus className="w-3" />}
          </span>
        </div>
        {expand && (
          <>
            {category.subCategories.map((sub) => (
              <section key={sub.id} className="pl-5 mt-2 leading-5 relative">
                <label
                  htmlFor={sub.id}
                  className="w-full flex items-center text-left cursor-pointer whitespace-nowrap select-none"
                  onClick={() => handleSubCategoryChange(sub.url)}
                >
                  <span className="mr-2 border border-[#ccc] w-3 h-3 rounded-full relative grid place-items-center">
                    {sub.url === subCategoryQuery && (
                      <div className="h-1.5 w-1.5 inline-block bg-black rounded-full"></div>
                    )}
                  </span>
                  <div className="flex-1 text-xs inline-block overflow-visible text-clip whitespace-normal">
                    {sub.name}
                  </div>
                </label>
              </section>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
