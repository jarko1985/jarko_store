"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Types
import { OrderStatus, PaymentStatus, StoreOrderType } from "@/lib/types";
import { getTimeUntil } from "@/lib/utils";
import PaymentStatusTag from "@/components/shared/payment-status";
import OrderStatusTag from "@/components/shared/order-status";
import OrderStatusSelect from "@/components/dashboard/forms/order-status-select";
import { Expand } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/dashboard/shared/custom-modal";
import StoreOrderSummary from "@/components/dashboard/shared/store-order-summary";

export const columns: ColumnDef<StoreOrderType>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => {
      return <span>{row.original.id}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const images = row.original.items.map((product) => product.image);
      return (
        <div className="flex flex-wrap gap-1">
          {images.map((img, i) => (
            <Image
              src={img}
              alt=""
              width={100}
              height={100}
              className="w-7 h-7 object-cover rounded-full"
              style={{ transform: `translateX(-${i * 15}px)` }}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      return (
        <div>
          <PaymentStatusTag
            status={row.original.order.paymentStatus as PaymentStatus}
            isTable
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <OrderStatusSelect
            groupId={row.original.id}
            status={row.original.status as OrderStatus}
            storeId={row.original.storeId}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return <span>${row.original.total.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => {
      const { setOpen } = useModal();
      return (
        <div>
          <button
            className="font-sans flex justify-center gap-2 items-center mx-auto  text-lg text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-primary hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            onClick={() => {
              setOpen(
                <CustomModal maxWidth="!max-w-3xl">
                  <StoreOrderSummary group={row.original} />
                </CustomModal>
              );
            }}
          >
            View
            <span className="w-7 h-7 rounded-full bg-white grid  place-items-center">
              <Expand className="w-5 stroke-black" />
            </span>
          </button>
        </div>
      );
    },
  },
];
