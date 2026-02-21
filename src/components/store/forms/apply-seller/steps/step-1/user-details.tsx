import Input from "@/components/store/ui/input";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRef } from "react";

export default function UserDetails() {
  const { user } = useUser();

  const btnConatinerRef = useRef<HTMLDivElement | null>(null);

  const handleImageClick = () => {
    const userButton = btnConatinerRef.current?.querySelector("button");
    if (userButton) {
      userButton.click();
    }
  };
  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="relative">
        {/* User Image */}
        <Image
          src={user?.imageUrl!}
          alt="User avatar"
          width={200}
          height={200}
          className="rounded-full cursor-pointer"
          onClick={handleImageClick}
        />
        {/* Hidden UserButton */}
        <div
          ref={btnConatinerRef}
          className="absolute inset-0 z-0 opacity-0 pointer-events-none"
        >
          <UserButton />
        </div>
      </div>
      {/* First Name Input */}
      <Input
        name="firstName"
        value={user?.firstName || ""}
        onChange={() => {}}
        type="text"
        readonly
      />
      {/* Last Name Input */}
      <Input
        name="lastName"
        value={user?.lastName || ""}
        onChange={() => {}}
        type="text"
        readonly
      />
    </div>
  );
}
