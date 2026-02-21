import { SearchResult } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  suggestions: SearchResult[];
  query: string;
}

const SearchSuggestions: FC<Props> = ({ suggestions, query }) => {
  const router = useRouter();
  const highlightText = (text: string, query: string) => {
    if (!query) return text; // Return original text if query is empty

    const regex = new RegExp(`(${query})`, "gi"); // Create a regex to match the query (case insensitive)
    const parts = text.split(regex); // Split the text by the query

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="text-orange-background">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handlePush = (link: string) => {
    router.push(link);
  };
  return (
    <div className="absolute top-11 w-full rounded-3xl bg-white text-main-primary shadow-2xl !z-[99] overflow-hidden">
      <div className="py-2">
        <ul>
          {suggestions.map((sugg) => (
            <li
              key={sugg.name}
              className="w-full h-20 px-6 cursor-pointer hover:bg-[#f5f5f5] flex items-center gap-x-2"
              onClick={() => handlePush(sugg.link)}
            >
              <Image
                src={sugg.image}
                alt=""
                width={100}
                height={100}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div>
                <span className="text-sm leading-6 my-1.5">
                  {highlightText(sugg.name, query)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchSuggestions;
