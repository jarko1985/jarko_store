"use client";
import {
  PaymentTableDateFilter,
  PaymentTableFilter,
  UserPaymentType,
} from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "../../shared/pagination";
import { getUserPayments } from "@/queries/profile";
import PaymentTableHeader from "./payment-table-header";

export default function PaymentsTable({
  payments,
  totalPages,
}: {
  payments: UserPaymentType[];
  totalPages: number;
}) {
  const [data, setData] = useState<UserPaymentType[]>(payments);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  // Filter
  const [filter, setFilter] = useState<PaymentTableFilter>("");

  // Date period filter
  const [period, setPeriod] = useState<PaymentTableDateFilter>("");

  // Search filter
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    // Reset to page 1 when filters or search changes
    setPage(1);
  }, [filter, period, search]);

  useEffect(() => {
    const getData = async () => {
      const res = await getUserPayments(filter, period, search, page);
      if (res) {
        setData(res.payments);
        setTotalDataPages(res.totalPages);
      }
    };
    getData();
  }, [page, filter, search, period]);
  return (
    <div>
      <div className="">
        {/* Header */}
        <PaymentTableHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="overflow-hidden">
          <div className="bg-white px-6 py-1">
            {/* Scrollable Table Container */}
            <div className="max-h-[700px] overflow-x-auto overflow-y-auto scrollbar border rounded-md">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Payment
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Intent ID
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Type
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Amount
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Status
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((payment) => {
                    const amount = payment.amount / 100;
                    return (
                      <tr key={payment.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p className="block antialiased font-sans text-sm leading-normal font-normal">
                                #{payment.id}
                              </p>
                              <p className="block antialiased font-sans text-sm leading-normal font-normal">
                                Last action: {payment.updatedAt.toDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{payment.paymentInetntId}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>${amount.toFixed(2)}</td>
                        <td>{payment.status}</td>
                        <td className="p-4">
                          <Link href={`/order/${payment.orderId}`}>
                            <span className="text-xs text-blue-primary cursor-pointer hover:underline">
                              View
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalDataPages} />
    </div>
  );
}
