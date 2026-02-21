export default function OrderTotalDetailsCard({
  details,
}: {
  details: {
    subTotal: number;
    shippingFees: number;
    total: number;
  };
}) {
  const { subTotal, shippingFees, total } = details;
  return (
    <div>
      <div className="p-4 shadow-sm w-full">
        <div className="flex justify-between">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-main-secondary">
              Subtotal
            </p>
            <p className="text-main-secondary text-sm">Shipping Fees</p>
            <p className="text-main-secondary text-sm">Taxes</p>
            <p className="text-lg font-semibold text-main-secondary">Total</p>
          </div>
          <div className="text-right space-y-4">
            <p className="text-lg font-semibold text-main-primary">
              ${subTotal.toFixed(2)}
            </p>
            <p className="mt-0.5 text-sm text-neutral-500">
              +${shippingFees.toFixed(2)}
            </p>
            <p className="mt-0.5 text-sm text-neutral-500">+$0.00</p>
            <p className="text-white px-3 text-sm py-1.5 bg-blue-primary rounded-lg font-semibold">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
