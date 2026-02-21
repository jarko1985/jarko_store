import { ProductType, VariantSimplified } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";

export default function ProductCardClean({
  product,
}: {
  product: ProductType;
}) {
  const [variant, setVariant] = useState<VariantSimplified>(
    product.variants[0]
  );

  const size = variant.sizes.reduce((lowest, current) => {
    const currentPriceAfterDiscount =
      current.price * (1 - current.discount / 100);
    const lowestPriceAfterDiscount = lowest.price * (1 - lowest.discount / 100);

    return currentPriceAfterDiscount < lowestPriceAfterDiscount
      ? current
      : lowest;
  });
  const numReviews = new Intl.NumberFormat().format(product.numReviews);
  return (
    <Link href={`/product/${product.slug}/${variant.variantSlug}`}>
      <div className="card">
        <div className="image-container">
          <Image src={variant.images[0].url} alt="" width={300} height={300} />
          <div className="price">${size.price}</div>
        </div>
        <div className="content">
          <div className="brand line-clamp-1">{variant.variantName}</div>
          <div className="product-name line-clamp-1">{product.name}</div>
          <div className="color-size-container">
            <div className="">
              <ul className="flex items-center gap-x-0.5">
                {product.variantImages.map((img, i) => (
                  <li
                    className=""
                    onMouseEnter={() => setVariant(product.variants[i])}
                  >
                    <Image
                      src={img.image}
                      alt=""
                      width={50}
                      height={50}
                      className="w-6 h-6 object-cover rounded-full"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rating h-4">
            <ReactStars
              count={5}
              size={18}
              color="#e2dfdf"
              value={product.rating}
              isHalf
              edit={false}
            />
            ({numReviews})
          </div>
        </div>
      </div>
    </Link>
  );
}
