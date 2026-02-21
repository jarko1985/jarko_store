"use client";
import { StoreDetailsType } from "@/lib/types";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";

export default function StoreDEetails({
  details,
}: {
  details: StoreDetailsType;
}) {
  const { averageRating, cover, description, logo, name, numReviews } = details;
  const numOfReviews = new Intl.NumberFormat().format(numReviews);

  return (
    <div className="relative w-full pb-28">
      <div className="relative">
        <Image
          src={cover}
          alt={name}
          width={2000}
          height={500}
          className="w-full h-96 object-cover"
        />
        <div className="absolute -bottom-[100px] left-11 flex items-end">
          <Image
            src={logo}
            alt={name}
            width={200}
            height={200}
            className="w-44 h-44 object-cover rounded-full shadow-2xl"
          />
          <div className="pl-1 mb-5">
            <div className="flex items-center gap-x-1">
              <h1 className="font-bold text-2xl capitalize leading-5">
                {name.toLowerCase()}
              </h1>
              <CircleCheckBig className="stroke-green-400 mt-0.5" />
            </div>
            <div className="flex items-center gap-x-1">
              <ReactStars
                count={5}
                value={averageRating}
                size={24}
                color="#e2dfdf"
                isHalf
                edit={false}
              />
              <p className="text-xs text-main-secondary">
                ({numOfReviews} reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
