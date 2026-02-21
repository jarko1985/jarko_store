import StoreStatusTag from "@/components/shared/store-status";
import { useToast } from "@/components/ui/use-toast";
import { StoreStatus } from "@/lib/types";
import { updateOrderGroupStatus } from "@/queries/order";
import { updateStoreStatus } from "@/queries/store";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface Props {
  storeId: string;
  status: StoreStatus;
}

const StoreStatusSelect: FC<Props> = ({ status, storeId }) => {
  const [newStatus, setNewStatus] = useState<StoreStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  // Options
  const options = Object.values(StoreStatus).filter((s) => s !== newStatus);

  // Handle click
  const handleClick = async (selectedStatus: StoreStatus) => {
    try {
      const response = await updateStoreStatus(storeId, selectedStatus);
      if (response) {
        setNewStatus(response as StoreStatus);
        setIsOpen(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.toString(),
      });
    }
  };
  return (
    <div className="relative">
      {/* Current status */}
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <StoreStatusTag status={newStatus} />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <StoreStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreStatusSelect;
