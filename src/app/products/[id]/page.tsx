import React from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/api";
import ProductDetailView from "@/components/products/ProductDetailView";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO Metadata generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `${product.title} • NextCart`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: "Product Not Found • NextCart",
    };
  }
}

// Next.js App Router Dynamic Server Component
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);
    if (!product || !product.id) {
      notFound();
    }
    return <ProductDetailView product={product} />;
  } catch (error) {
    console.error(`Failed to load product ${id}:`, error);
    notFound();
  }
}
