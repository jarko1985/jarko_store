"use client";
import { CartProductType, ProductPageDataType } from "@/lib/types";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnPrivacySecurityCard from "./returns-security-privacy-card";
import { cn, isProductValidToAdd, updateProductHistory } from "@/lib/utils";
import QuantitySelector from "./quantity-selector";
import SocialShare from "../shared/social-share";
import { ProductVariantImage } from "@prisma/client";
import { useCartStore } from "@/cart-store/useCartStore";
import toast from "react-hot-toast";
import useFromStore from "@/hooks/useFromStore";
import { setCookie } from "cookies-next";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  // If there is no product data available, render nothing (null)
  if (!productData) return null;
  const { productId, variantId, variantSlug, images, shippingDetails, sizes } =
    productData;
  if (typeof shippingDetails === "boolean") return null;

  // State for temporary product images
  const [variantImages, setVariantImages] =
    useState<ProductVariantImage[]>(images);

  // useState hook to manage the active image being displayed, initialized to the first image in the array
  const [activeImage, setActiveImage] = useState<ProductVariantImage | null>(
    images[0]
  );

  // Initialize the default product data for the cart item
  const data: CartProductType = {
    productId: productData.productId,
    variantId: productData.variantId,
    productSlug: productData.productSlug,
    variantSlug: productData.variantSlug,
    name: productData.name,
    variantName: productData.variantName,
    image: productData.images[0].url,
    variantImage: productData.variantImage,
    quantity: 1,
    price: 0,
    sizeId: sizeId || "",
    size: "",
    stock: 1,
    weight: productData.weight,
    shippingMethod: shippingDetails.shippingFeeMethod,
    shippingService: shippingDetails.shippingService,
    shippingFee: shippingDetails.shippingFee,
    extraShippingFee: shippingDetails.extraShippingFee,
    deliveryTimeMin: shippingDetails.deliveryTimeMin,
    deliveryTimeMax: shippingDetails.deliveryTimeMax,
    isFreeShipping: shippingDetails.isFreeShipping,
  };

  // useState hook to manage the product's state in the cart
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  const { stock } = productToBeAddedToCart;

  // Usestate hook to manage product validity to be added to cart
  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  // Function to handle state changes for the product properties
  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
  };

  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart);
    setIsProductValid(check);
  }, [productToBeAddedToCart]);

  // Get the store action to add items to cart
  const addToCart = useCartStore((state) => state.addToCart);

  // Get the set Cart action to update items in cart
  const setCart = useCartStore((state) => state.setCart);

  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  // Keeping cart state updated
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the "cart" key was changed in localStorage
      if (event.key === "cart") {
        try {
          const parsedValue = event.newValue
            ? JSON.parse(event.newValue)
            : null;

          // Check if parsedValue and state are valid and then update the cart
          if (
            parsedValue &&
            parsedValue.state &&
            Array.isArray(parsedValue.state.cart)
          ) {
            setCart(parsedValue.state.cart);
          }
        } catch (error) {
          console.error("Failed to parse updated cart data:", error);
        }
      }
    };

    // Attach the event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add product to history
  updateProductHistory(variantId);

  const handleAddToCart = () => {
    if (maxQty <= 0) return;
    addToCart(productToBeAddedToCart);
    toast.success("Product added to cart successfully.");
  };

  const maxQty = useMemo(() => {
    const search_product = cartItems?.find(
      (p) =>
        p.productId === productId &&
        p.variantId === variantId &&
        p.sizeId === sizeId
    );
    return search_product
      ? search_product.stock - search_product.quantity
      : stock;
  }, [cartItems, productId, variantId, sizeId, stock]);

  // Set view cookie
  setCookie(`viewedProduct_${productId}`, "true", {
    maxAge: 3600,
    path: "/",
  });

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper
          images={variantImages.length > 0 ? variantImages : images}
          activeImage={activeImage || images[0]}
          setActiveImage={setActiveImage}
        />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo
            productData={productData}
            sizeId={sizeId}
            handleChange={handleChange}
            setVariantImages={setVariantImages}
            setActiveImage={setActiveImage}
          />
          {/* Shipping details - buy actions buttons */}
          <div className="w-[390px]">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShipTo
                      countryCode={shippingDetails.countryCode}
                      countryName={shippingDetails.countryName}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={1}
                        weight={productData.weight}
                      />
                    </div>
                    <ReturnPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                    />
                  </>
                )}
                {/* Action buttons */}
                <div className="mt-5 bg-white bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        handleChange={handleChange}
                        sizes={sizes}
                      />
                    </div>
                  )}
                  {/* Action buttons */}
                  <button className="relative w-full py-2.5 min-w-20 bg-orange-background hover:bg-orange-hover text-white h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none">
                    <span>Buy now</span>
                  </button>
                  <button
                    disabled={!isProductValid}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 bg-orange-border hover:bg-[#e4cdce] text-orange-hover h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
                      {
                        "cursor-not-allowed": !isProductValid || maxQty <= 0,
                      }
                    )}
                    onClick={() => handleAddToCart()}
                  >
                    <span>Add to cart</span>
                  </button>
                  {/* Share to socials */}
                  <SocialShare
                    url={`/product/${productData.productSlug}/${productData.variantSlug}`}
                    quote={`${productData.name} · ${productData.variantName}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
