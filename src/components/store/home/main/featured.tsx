"use client";
import Link from "next/link";
import MainSwiper from "../../shared/swiper";
import { SimpleProduct } from "@/lib/types";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Featured({ products }: { products: SimpleProduct[] }) {
  const is1170px = useMediaQuery({ query: "(min-width: 1170px)" });
  const is1700px = useMediaQuery({ query: "(min-width: 1700px)" });

  // State to store the current width of the screen
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    // Function to handle resize event and update screen width
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add the resize event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative rounded-md overflow-hidden">
      <div
        className="w-full flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/images/ads/featured.webp)" }}
      >
        {/* Coupon */}
        <Link href="/">
          <div className="w-52 px-3 float-left relative h-[190px]">
            <div className="flex flex-col justify-center items-center h-[103px]">
              <h3 className="leading-5 font-bold my-1 text-white w-full">
                Wecome Newcomers!
              </h3>
              <p className="text-sm w-full text-white">
                Enjoy shopping made easy like nothing before
              </p>
            </div>
            <div
              className="absolute w-[192px] h-[55px] pl-[14px] text-white overflow-hidden pr-[45px] bottom-[35px] 
              text-left bg-contain bg-no-repeat"
              style={{ backgroundImage: "url(/assets/images/ads/coupon.gif)" }}
            >
              <h3 className="text-[20px] leading-6 mt-[11px] mb-1 text-white w-full">
                use 'MHAJJI'
              </h3>
              <p className="overflow-hidden overflow-ellipsis w-full text-xs -translate-y-1">
                for 87% off
              </p>
            </div>
          </div>
        </Link>
        {/* Product swiper */}
        <div
          className={is1700px ? "ml-10" : ""}
          style={{
            width: !is1170px
              ? `${screenWidth - 300}px` // Less than 1170px
              : is1700px
              ? "750px" // More than 1700px
              : `calc(500px + 5vw)`, // Between 1170-1700px
          }}
        >
          {/*
            
            1170-1700===>
            */}
          <MainSwiper
            products={products}
            type="simple"
            slidesPerView={1}
            spaceBetween={-10}
          />
        </div>
      </div>
    </div>
  );
}
