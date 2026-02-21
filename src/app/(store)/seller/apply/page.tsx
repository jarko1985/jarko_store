import ApplySellerMultiForm from "@/components/store/forms/apply-seller/apply-seller";
import MinimalHeader from "@/components/store/layout/minimal-header/header";

export default function SellerApplyPage() {
  return (
    <div className="bg-[#eef4fc] h-screen overflow-y-hidden">
      <MinimalHeader />
      <ApplySellerMultiForm />
    </div>
  );
}
