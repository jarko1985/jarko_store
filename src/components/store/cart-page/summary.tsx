import { CartProductType } from "@/lib/types";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveUserCart } from "@/queries/user";
import { PulseLoader } from "react-spinners";

interface Props {
  cartItems: CartProductType[];
  shippingFees: number;
}

const CartSummary: FC<Props> = ({ cartItems, shippingFees }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate subtotal from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate total price including shipping fees
  const total = subtotal + shippingFees;

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const res = await saveUserCart(cartItems);
      if (res) router.push("/checkout");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div className="relative py-4 px-6 bg-white">
      <h1 className="text-gray-900 text-2xl font-bold mb-4">Summary</h1>
      <div className="mt-4 font-medium flex items-center text-[#222] text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Subtotal
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-black">
            <div className="text-black text-lg inline-block break-all">
              ${subtotal.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-medium flex items-center text-[#222] text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Shipping Fees
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-black">
            <div className="text-black text-lg inline-block break-all">
              +${shippingFees.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-medium flex items-center text-[#222] text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Taxes
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-black">
            <div className="text-black text-lg inline-block break-all">
              +$0.00
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-bold flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-black">
            <div className="text-black text-lg inline-block break-all">
              ${total.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="my-2 5">
        <Button onClick={() => handleSaveCart()}>
          {loading ? (
            <PulseLoader size={5} color="#fff" />
          ) : (
            <span>Checkout ({cartItems.length})</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
