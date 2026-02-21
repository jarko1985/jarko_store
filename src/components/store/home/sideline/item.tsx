import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface Props {
  link: string;
  image: StaticImageData;
  children?: ReactNode;
  className?: string;
  arrowClassName?: string;
  w_fit?: boolean;
}

const SidelineItem: FC<Props> = ({
  image,
  link,
  arrowClassName,
  children,
  className,
  w_fit,
}) => {
  return (
    <Link href={link}>
      <div className="relative group mt-4 w-10 h-10  flex items-center justify-center hover:bg-[#ff4747]">
        <Image src={image} width={35} height={35} alt="" />
        <div
          className={cn(
            "hidden group-hover:flex absolute -left-28 ",
            className,
            {
              "-left-20": w_fit,
            }
          )}
        >
          <span
            className={cn(
              "bg-[#373737] text-white w-24 px-4 py-[0.8rem] rounded-sm transition-all duration-500 ease-in",
              {
                "!w-fit": w_fit,
              }
            )}
          >
            {children}
          </span>
          <div
            className={cn(
              "w-0 h-0 border-[12px] border-transparent border-l-[#373737] border-r-0 transition-all duration-500 ease-in-out mt-[11px]",
              arrowClassName
            )}
          />
        </div>
      </div>
    </Link>
  );
};

export default SidelineItem;
