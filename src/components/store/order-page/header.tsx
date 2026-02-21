"use client";
import OrderStatusTag from "@/components/shared/order-status";
import PaymentStatusTag from "@/components/shared/payment-status";
import { Button } from "@/components/ui/button";
import { OrderFulltType, OrderStatus, PaymentStatus } from "@/lib/types";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import React from "react";
import { generateOrderPDFBlob } from "./pdf-invoice";
import { downloadBlobAsFile, printPDF } from "@/lib/utils";

export default function OrderHeader({ order }: { order: OrderFulltType }) {
  if (!order) return;

  const handleDownload = async () => {
    try {
      const pdfBlob = await generateOrderPDFBlob(order);
      downloadBlobAsFile(pdfBlob, `Order_${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = async () => {
    try {
      const pdfBlob = await generateOrderPDFBlob(order);
      printPDF(pdfBlob);
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };
  return (
    <div>
      <div className="w-full border-b flex items-center justify-between p-2">
        <div className="flex items-center gap-x-3">
          <div className="border-r pr-4">
            <button className="w-10 h-10 border rounded-full grid place-items-center">
              <ChevronLeft className="stroke-main-secondary" />
            </button>
          </div>
          <h1 className="text-main-secondary">Order Details</h1>
          <ChevronRight className="stroke-main-secondary w-4" />
          <h2>Order #{order.id}</h2>
          <PaymentStatusTag status={order.paymentStatus as PaymentStatus} />
          <OrderStatusTag status={order.orderStatus as OrderStatus} />
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="outline" onClick={() => handleDownload()}>
            <Download className="w-4 me-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => handlePrint()}>
            <Printer className="w-4 me-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
