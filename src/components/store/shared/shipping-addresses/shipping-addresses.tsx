import { UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { Plus } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Modal from "../modal";
import AddressDetails from "./address-details";
import AddressList from "./address-list";

interface Props {
  countries: Country[];
  addresses: UserShippingAddressType[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<ShippingAddress | null>>;
}

const UserShippingAddresses: FC<Props> = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="relative flex flex-col text-sm">
        <h1 className="text-lg mb-3 font-bold">Shipping Addresses</h1>
        {addresses && addresses.length > 0 && (
          <AddressList
            addresses={addresses}
            countries={countries}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )}
        <div
          className="mt-4 ml-8 text-orange-background cursor-pointer"
          onClick={() => setShow(true)}
        >
          <Plus className="inline-block mr-1 w-3" />
          <span className="text-sm">Add new address</span>
        </div>
        {/* Modal */}
        <Modal title="Add new Address" show={show} setShow={setShow}>
          <AddressDetails countries={countries} setShow={setShow} />
        </Modal>
      </div>
    </div>
  );
};

export default UserShippingAddresses;
