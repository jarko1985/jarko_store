import { StoreStatus } from "@/lib/types";
import { Store } from "lucide-react"; // Lucide store icon

interface StoreStatusTagProps {
  status: StoreStatus;
}

const storeStatusStyles: {
  [key in StoreStatus]: { bgColor: string; textColor: string; label: string };
} = {
  [StoreStatus.PENDING]: {
    bgColor: "bg-gray-100 dark:bg-gray-500/10",
    textColor: "text-gray-800 dark:text-gray-500",
    label: "Pending",
  },
  [StoreStatus.ACTIVE]: {
    bgColor: "bg-green-100 dark:bg-green-500/10",
    textColor: "text-green-800 dark:text-green-500",
    label: "Active",
  },
  [StoreStatus.BANNED]: {
    bgColor: "bg-red-100 dark:bg-red-500/10",
    textColor: "text-red-800 dark:text-red-500",
    label: "Banned",
  },
  [StoreStatus.DISABLED]: {
    bgColor: "bg-yellow-100 dark:bg-yellow-500/10",
    textColor: "text-yellow-800 dark:text-yellow-500",
    label: "Disabled",
  },
};

const StoreStatusTag: React.FC<StoreStatusTagProps> = ({ status }) => {
  const styles = storeStatusStyles[status];

  return (
    <div>
      <span
        className={`py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${styles.bgColor} ${styles.textColor}`}
      >
        <Store className="shrink-0 size-3" /> {/* Lucide Store Icon */}
        {styles.label}
      </span>
    </div>
  );
};

export default StoreStatusTag;
