import { db } from "@/lib/db";
import client from "@/lib/elasticsearch";
import { NextResponse } from "next/server";

// POST handler for indexing products and variants to Elasticsearch
export async function POST() {
  try {
    // Delete all indices
    await client.indices.delete({ index: "_all" });

    // Fetch products and their variants from the database using Prisma
    const products = await db.product.findMany({
      include: {
        variants: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });

    // Prepare the body for bulk indexing in Elasticsearch
    const body = products.flatMap((product) =>
      product.variants.flatMap((variant) => [
        {
          index: { _index: "products", _id: variant.id }, // Index by variant ID
        },
        {
          name: `${product.name} · ${variant.variantName}`, // Combined name
          link: `/product/${product.slug}/${variant.slug}`, // Link to product variant
          image: variant.images[0].url, // Variant image URL
        },
      ])
    );

    // Execute the bulk request to Elasticsearch
    const bulkResponse = await client.bulk({ refresh: true, body });

    // Check for any errors in the bulk response
    if (bulkResponse.errors) {
      return NextResponse.json(
        {
          message: "Failed to index products and variants",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Products indexed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle any unexpected errors
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
