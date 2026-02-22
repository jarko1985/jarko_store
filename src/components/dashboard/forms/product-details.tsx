"use client";

// React, Next.js
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import {
  Category,
  Country,
  OfferTag,
  ShippingFeeMethod,
  SubCategory,
} from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ProductFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "react-multi-select-component";

// Queries
import { upsertProduct } from "@/queries/product";
import { getAllCategoriesForCategory } from "@/queries/category";

// ReactTags
import { WithOutContext as ReactTags } from "react-tag-input";

// Utils
import { v4 } from "uuid";

// Types
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// Jodit text editor
import JoditEditor from "jodit-react";
import { NumberInput } from "@tremor/react";
import InputFieldset from "../shared/input-fieldset";
import { ArrowRight, Dot } from "lucide-react";
import { useTheme } from "next-themes";

const shippingFeeMethods = [
  {
    value: ShippingFeeMethod.ITEM,
    description: "ITEM (Fees calculated based on number of products.)",
  },
  {
    value: ShippingFeeMethod.WEIGHT,
    description: "WEIGHT (Fees calculated based on product weight)",
  },
  {
    value: ShippingFeeMethod.FIXED,
    description: "FIXED (Fees are fixed.)",
  },
];

interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  offerTags: OfferTag[];
  storeUrl: string;
  countries: Country[];
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  offerTags,
  storeUrl,
  countries,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Is new variant page
  const isNewVariantPage = data?.productId && !data?.variantId;

  // Jodit editor refs
  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // Jodit configuration
  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      theme: theme === "dark" ? "dark" : "default",
    }),
    [theme]
  );

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
  );

  // Temporary state for images
  const [images, setImages] = useState<{ url: string }[]>([]);

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // State for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onSubmit", // Validate on submit - ensures zod runs before handleSubmit
    resolver: zodResolver(ProductFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available) - use empty strings/arrays for new to avoid undefined serialization
      name: data?.name ?? "",
      description: data?.description ?? "",
      variantName: data?.variantName ?? "",
      variantDescription: data?.variantDescription ?? "",
      images: data?.images ?? [],
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId ?? "",
      offerTagId: data?.offerTagId ?? "",
      subCategoryId: data?.subCategoryId ?? "",
      brand: data?.brand ?? "",
      sku: data?.sku ?? "",
      colors: data?.colors ?? [{ color: "" }],
      sizes: data?.sizes ?? [{ size: "", quantity: 1, price: 0.01, discount: 0 }],
      product_specs: data?.product_specs ?? [{ name: "", value: "" }],
      variant_specs: data?.variant_specs ?? [{ name: "", value: "" }],
      keywords: data?.keywords ?? [],
      questions: data?.questions ?? [{ question: "", answer: "" }],
      isSale: data?.isSale ?? false,
      weight: data?.weight ?? 0.01,
      saleEndDate:
        data?.saleEndDate ?? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      freeShippingForAllCountries: data?.freeShippingForAllCountries ?? false,
      freeShippingCountriesIds: data?.freeShippingCountriesIds ?? [],
      shippingFeeMethod: data?.shippingFeeMethod ?? "ITEM",
    },
  });

  const { register } = form;

  const saleEndDate = form.getValues().saleEndDate || new Date().toISOString();

  const formattedDate = new Date(saleEndDate).toLocaleString("en-Us", {
    weekday: "short", // Abbreviated day name (e.g., "Mon")
    month: "long", // Abbreviated month name (e.g., "Nov")
    day: "2-digit", // Two-digit day (e.g., "25")
    year: "numeric", // Full year (e.g., "2024")
    hour: "2-digit", // Two-digit hour (e.g., "02")
    minute: "2-digit", // Two-digit minute (e.g., "30")
    second: "2-digit", // Two-digit second (optional)
    hour12: false, // 12-hour format (change to false for 24-hour format)
  });

  // UseEffect to get subCategories when user pick/change a category
  const categoryId = form.watch("categoryId");
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllCategoriesForCategory(categoryId || "");
      setSubCategories(res);
      if (!categoryId) form.setValue("subCategoryId", "");
    };
    getSubCategories();
  }, [categoryId, form]);

  // Extract errors state from form
  const errors = form.formState.errors;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        variantImage: data.variantImage ? [{ url: data.variantImage }] : [],
      });
    }
  }, [data, form]);

  // Submit handler for form submission (mirrors category-details handleSubmit logic)
  // Zod validation runs first - if we reach here, values are valid
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      const name = String(values.name ?? "").trim();
      const description = String(values.description ?? "").trim();
      const variantName = String(values.variantName ?? "").trim();
      const variantDescription = String(values.variantDescription ?? "").trim();
      const variantImageUrl = values.variantImage?.[0]?.url ?? "";
      const categoryId = String(values.categoryId ?? "").trim();
      const subCategoryId = String(values.subCategoryId ?? "").trim();
      const brand = String(values.brand ?? "").trim();
      const sku = String(values.sku ?? "").trim();
      const images = values.images ?? [];
      const weight = Number(values.weight) || 0.01;

      // Upserting product data
      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name,
          description,
          variantName,
          variantDescription,
          images,
          variantImage: variantImageUrl,
          categoryId,
          subCategoryId,
          offerTagId: values.offerTagId ?? "",
          isSale: values.isSale ?? false,
          saleEndDate: values.saleEndDate ?? "",
          brand,
          sku,
          weight,
          colors: values.colors ?? [],
          sizes: values.sizes ?? [],
          product_specs: values.product_specs ?? [],
          variant_specs: values.variant_specs ?? [],
          keywords: values.keywords ?? [],
          questions: values.questions ?? [],
          shippingFeeMethod: values.shippingFeeMethod ?? "ITEM",
          freeShippingForAllCountries: values.freeShippingForAllCountries ?? false,
          freeShippingCountriesIds: values.freeShippingCountriesIds ?? [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );

      // Displaying success message
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product has been updated."
            : `Congratulations! product is now created.`,
      });

      // Redirect or Refresh data
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
    form.setValue("questions", questions);
  }, [colors, sizes, keywords, productSpecs, questions, variantSpecs, data]);

  //Countries options
  type CountryOption = {
    label: string;
    value: string;
  };

  const countryOptions: CountryOption[] = countries.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const handleDeleteCountryFreeShipping = (index: number) => {
    const currentValues = form.getValues().freeShippingCountriesIds;
    const updatedValues = currentValues.filter((_, i) => i !== index);
    form.setValue("freeShippingCountriesIds", updatedValues);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isNewVariantPage
              ? `Add a new variant to ${data.name}`
              : "Create a new product"}
          </CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name} product information.`
              : " Lets create a product. You can edit product later from the product page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                toast({
                  variant: "destructive",
                  title: "Validation Error",
                  description: Object.values(errors)
                    .map((e) => e?.message)
                    .filter(Boolean)
                    .join(". ") || "Please check the form and fix the errors.",
                });
              })}
              className="space-y-4"
            >
              {/* Images - colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={data?.colors || colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Name */}
              <InputFieldset label="Name">
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="product-name">Product name</Label>
                      <Input
                        id="product-name"
                        placeholder="Product name"
                        disabled={isLoading}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="variant-name">Variant name</Label>
                    <Input
                      id="variant-name"
                      placeholder="Variant name"
                      disabled={isLoading}
                      {...register("variantName")}
                    />
                    {errors.variantName && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.variantName.message}
                      </p>
                    )}
                  </div>
                </div>
              </InputFieldset>
              {/* Product and variant description editors (tabs) */}
              <InputFieldset
                label="Description"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product description is the main description for the product (Will display in every variant page). You can add an extra description specific to this variant using 'Variant description' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variant" : "product"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="product">
                        Product description
                      </TabsTrigger>
                      <TabsTrigger value="variant">
                        Variant description
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="product">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={productDescEditor}
                              config={config}
                              value={field.value ?? ""}
                              onChange={(content) => field.onChange(content)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="variant">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="variantDescription"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={variantDescEditor}
                              config={config}
                              value={field.value ?? ""}
                              onChange={(content) => field.onChange(content)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </InputFieldset>
              {/* Category - SubCategory - offer*/}
              {!isNewVariantPage && (
                <InputFieldset label="Category">
                  <div className="flex gap-4 flex-wrap">
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <Label htmlFor="product-category">Category</Label>
                      <select
                        id="product-category"
                        disabled={isLoading || categories.length === 0}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("categoryId")}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.categoryId.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <Label htmlFor="product-subcategory">Sub-category</Label>
                      <select
                        id="product-subcategory"
                        disabled={
                          isLoading ||
                          subCategories.length === 0 ||
                          !form.getValues("categoryId")
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("subCategoryId")}
                      >
                        <option value="">Select a sub-category</option>
                        {subCategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {errors.subCategoryId && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.subCategoryId.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <Label htmlFor="product-offertag">Offer tag</Label>
                      <select
                        id="product-offertag"
                        disabled={isLoading || !offerTags?.length}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("offerTagId")}
                      >
                        <option value="">Select an offer (optional)</option>
                        {offerTags?.map((offer) => (
                          <option key={offer.id} value={offer.id}>
                            {offer.name}
                          </option>
                        ))}
                      </select>
                      {errors.offerTagId && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.offerTagId?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </InputFieldset>
              )}
              {/* Brand, Sku, Weight */}
              <InputFieldset
                label={isNewVariantPage ? "Sku, Weight" : "Brand, Sku, Weight"}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="product-brand">Product brand</Label>
                      <Input
                        id="product-brand"
                        placeholder="Product brand"
                        disabled={isLoading}
                        {...register("brand")}
                      />
                      {errors.brand && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="product-sku">Product sku</Label>
                    <Input
                      id="product-sku"
                      placeholder="Product sku"
                      disabled={isLoading}
                      {...register("sku")}
                    />
                    {errors.sku && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.sku.message}
                      </p>
                    )}
                  </div>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Product weight"
                            min={0.01}
                            step={0.01}
                            className="!shadow-none rounded-md !text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>
              {/* Variant image - Keywords*/}
              <div className="flex items-center gap-10 py-14">
                {/* Variant image */}
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14">Variant Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
                            type="profile"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => field.onChange([{ url }])}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </FormControl>
                        <FormMessage className="!mt-4" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Keywords */}
                <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={() => {}}
                            placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Sizes*/}
              <InputFieldset label="Sizes, Quantities, Prices, Disocunts">
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputs
                    details={sizes}
                    setDetails={setSizes}
                    initialDetail={{
                      size: "",
                      quantity: 1,
                      price: 0.01,
                      discount: 0,
                    }}
                    containerClassName="flex-1"
                    inputClassName="w-full"
                  />
                  {errors.sizes && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.sizes.message}
                    </span>
                  )}
                </div>
              </InputFieldset>
              {/* Product and variant specs*/}
              <InputFieldset
                label="Specifications"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product specifications are the main specs for the product (Will display in every variant page). You can add extra specs specific to this variant using 'Variant Specifications' tab."
                }
              >
                <Tabs
                  defaultValue={
                    isNewVariantPage ? "variantSpecs" : "productSpecs"
                  }
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="productSpecs">
                        Product Specifications
                      </TabsTrigger>
                      <TabsTrigger value="variantSpecs">
                        Variant Specifications
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="productSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={productSpecs}
                        setDetails={setProductSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.product_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.product_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="variantSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={variantSpecs}
                        setDetails={setVariantSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.variant_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.variant_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </InputFieldset>
              {/* Questions*/}
              {!isNewVariantPage && (
                <InputFieldset label="Questions & Answers">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={questions}
                      setDetails={setQuestions}
                      initialDetail={{
                        question: "",
                        answer: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.questions && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.questions.message}
                      </span>
                    )}
                  </div>
                </InputFieldset>
              )}
              {/* Is On Sale */}
              <InputFieldset
                label="Sale"
                description="Is your product on sale ?"
              >
                <div>
                  <label
                    htmlFor="yes"
                    className="ml-5 flex items-center gap-x-2 cursor-pointer"
                  >
                    <FormField
                      control={form.control}
                      name="isSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <input
                                type="checkbox"
                                id="yes"
                                checked={field.value}
                                onChange={field.onChange}
                                hidden
                              />
                              <Checkbox
                                checked={field.value}
                                // @ts-ignore
                                onCheckedChange={field.onChange}
                              />
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>Yes</span>
                  </label>
                  {form.getValues().isSale && (
                    <div className="mt-5">
                      <p className="text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                        <Dot className="-me-1" />
                        When sale does end ?
                      </p>
                      <div className="flex items-center gap-x-5">
                        <FormField
                          control={form.control}
                          name="saleEndDate"
                          render={({ field }) => (
                            <FormItem className="ml-4">
                              <FormControl>
                                <DateTimePicker
                                  className="inline-flex items-center gap-2 p-2 border rounded-md shadow-sm"
                                  calendarIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      📅
                                    </span>
                                  }
                                  clearIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      ✖️
                                    </span>
                                  }
                                  onChange={(date) => {
                                    field.onChange(
                                      date
                                        ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                  value={
                                    field.value ? new Date(field.value) : null
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <ArrowRight className="w-4 text-[#1087ff]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </InputFieldset>
              {/* Shipping fee method */}
              {!isNewVariantPage && (
                <InputFieldset label="Product shipping fee method">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="shippingFeeMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Shipping Fee Calculation method"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingFeeMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </InputFieldset>
              )}
              {/* Fee Shipping */}
              {!isNewVariantPage && (
                <InputFieldset
                  label="Free Shipping (Optional)"
                  description="Free Shipping Worldwide ?"
                >
                  <div>
                    <label
                      htmlFor="freeShippingForAll"
                      className="ml-5 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FormField
                        control={form.control}
                        name="freeShippingForAllCountries"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  type="checkbox"
                                  id="freeShippingForAll"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  hidden
                                />
                                <Checkbox
                                  checked={field.value}
                                  // @ts-ignore
                                  onCheckedChange={field.onChange}
                                />
                              </>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  <div>
                    <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                      <Dot className="-me-1" />
                      If not select the countries you want to ship this product
                      to for free
                    </p>
                  </div>
                  <div className="">
                    {!form.getValues().freeShippingForAllCountries && (
                      <div>
                        <FormField
                          control={form.control}
                          name="freeShippingCountriesIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MultiSelect
                                  className="!max-w-[800px]"
                                  options={countryOptions} // Array of options, each with `label` and `value`
                                  value={field.value} // Pass the array of objects directly
                                  onChange={(selected: CountryOption[]) => {
                                    field.onChange(selected);
                                  }}
                                  labelledBy="Select"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                          <Dot className="-me-1" />
                          List of countries you offer free shipping for this
                          product :&nbsp;
                          {form.getValues().freeShippingCountriesIds &&
                            form.getValues().freeShippingCountriesIds.length ===
                              0 &&
                            "None"}
                        </p>
                        {/* Free shipping counties */}
                        <div className="flex flex-wrap gap-1">
                          {form
                            .getValues()
                            .freeShippingCountriesIds?.map((country, index) => (
                              <div
                                key={country.id}
                                className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-primary rounded-md gap-x-2"
                              >
                                <span>{country.label}</span>
                                <span
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleDeleteCountryFreeShipping(index)
                                  }
                                >
                                  x
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InputFieldset>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.productId && data.variantId
                  ? "Save product information"
                  : "Create product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
