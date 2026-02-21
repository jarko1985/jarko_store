import OrderStatusTag from "@/components/shared/order-status";
import { OrderGroupWithItemsType, OrderStatus } from "@/lib/types";
import Image from "next/image";
import React from "react";
import ProductRow from "./product-row";

export default function OrderGroupTable({
  group,
  deliveryInfo,
}: {
  group: OrderGroupWithItemsType;
  deliveryInfo: {
    shippingService: string;
    deliveryMinDate: string;
    deliveryMaxDate: string;
  };
}) {
  const { shippingService, deliveryMaxDate, deliveryMinDate } = deliveryInfo;
  const { coupon, couponId, subTotal, total, shippingFees } = group;
  let discountedAmount = 0;
  if (couponId && coupon) {
    discountedAmount = ((subTotal + shippingFees) * coupon.discount) / 100;
  }
  return (
    <div className="border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
        <div>
          <p className="font-semibold text-base leading-7 text-black">
            Order Id:
            <span className="text-blue-primary font-medium ms-2">
              #{group.id}
            </span>
          </p>
          <div className="flex items-center gap-x-2 mt-4">
            <Image
              src={group.store.logo}
              alt={group.store.name}
              width={100}
              height={100}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-main-secondary font-medium">
              {group.store.name}
            </span>
            <div className="w-[1px] h-5 bg-border mx-2" />
            <p>{shippingService}</p>
            <div className="w-[1px] h-5 bg-border mx-2" />
          </div>
        </div>
        <OrderStatusTag status={group.status as OrderStatus} />
      </div>
      <div
        className="w-full px-3 min-[400px]:px-6 grid"
        style={{ gridTemplateColumns: "4fr 1fr" }}
      >
        <div>
          {group.items.map((product, index) => (
            <ProductRow key={index} product={product} />
          ))}
        </div>
        <div className="flex items-center max-lg:mt-3 text-center">
          <div className="flex gap-3 lg:block">
            <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
              Expected Delivery Time
            </p>
            <p className="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
              {deliveryMinDate} - {deliveryMaxDate}
            </p>
          </div>
        </div>
      </div>
      {/* Group info */}
      <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
          <button className="flex outline-0 py-6 sm:pr-6 sm:borde-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg text-black bg-white transition-all duration-500 hover:text-blue-primary">
            <svg
              className="stroke-black transition-all duration-500 group-hover:stroke-blue-primary"
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Cancel Order
          </button>
          <p className="font-medium text-lg text-gray-900 px-6 py-3 max-lg:text-center border-r">
            Subtotal:
            <span className="text-gray-500 ms-1">
              ${group.subTotal.toFixed(2)}
            </span>
          </p>
          <p className="font-medium text-lg text-gray-900 px-6 py-3 max-lg:text-center border-r">
            Shipping Fees:
            <span className="text-gray-500 ms-1">
              ${group.shippingFees.toFixed(2)}
            </span>
          </p>
          {group.couponId && (
            <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center">
              Coupon ({coupon?.code})
              <span className="text-gray-500 ms-1">(-{coupon?.discount}%)</span>
              <span className="text-gray-500 ms-1">
                (-${discountedAmount.toFixed(2)})
              </span>
            </p>
          )}
        </div>
        <div>
          <p className="font-semibold text-xl text-black py-2">
            Total price:
            <span className="text-blue-primary ms-1">${total.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
