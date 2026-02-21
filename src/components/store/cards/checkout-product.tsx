import { CartItem } from "@prisma/client";
import { ChevronRight, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutProductCard({
  product,
  isDiscounted,
}: {
  product: CartItem;
  isDiscounted: boolean;
}) {
  const { productSlug, variantSlug, sizeId, shippingFee } = product;
  return (
    <div className="bg-white px-6 border-t bordet-t-[#ebebeb] select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            <Link
              href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
            >
              <div className="m-0 mr-4 ml-2 w-28 h-28 bg-gray-200 relative rounded-lg">
                <Image
                  src={product.image}
                  width={200}
                  height={200}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis"
              >
                {product.name}
              </Link>
            </div>
            {/* Style - Size */}
            <div className="my-1">
              <button className="text-main-primary relative h-[24px] bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer  outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {product.size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Delievery */}
            <div className="flex flex-col justify-between mt-2 relative">
              {/* Price - Qty */}
              <div className="font-bold w-full flex items-start justify-between">
                <div className="flex items-center gap-x-2">
                  <span className="inline-block break-all">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </span>
                  {isDiscounted && (
                    <span className="text-xs font-normal text-orange-background">
                      (Coupon applied)
                    </span>
                  )}
                </div>
              </div>
              {/* Shipping fee */}

              <div className="mt-1 text-xs cursor-pointer">
                <div className="flex items-center mb-1">
                  <span>
                    <Truck className="w-4 inline-block text-[#01a971]" />
                    <span className="text-[#01a971] ml-1">
                      {shippingFee
                        ? `$${shippingFee.toFixed(2)}`
                        : "Free Delivery"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
