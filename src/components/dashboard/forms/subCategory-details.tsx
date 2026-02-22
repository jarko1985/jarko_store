"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Category, SubCategory } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { SubCategoryFormSchema } from "@/lib/schemas";

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

// Queries
import { upsertSubCategory } from "@/queries/subCategory";

// Utils
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(SubCategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available) - use empty strings for new to avoid undefined serialization
      name: data?.name ?? "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
      categoryId: data?.categoryId ?? "",
    },
  });

  const { register, formState: { errors } } = form;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: [{ url: data.image }],
        url: data.url,
        featured: data.featured,
        categoryId: data.categoryId,
      });
    }
  }, [data, form]);

  // Submit handler for form submission (mirrors category-details handleSubmit logic)
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      const name = String(values.name ?? "").trim();
      const url = String(values.url ?? "").trim();
      const imageUrl = values.image?.[0]?.url ?? "";
      const categoryId = String(values.categoryId ?? "").trim();

      if (!name || !url || !imageUrl || !categoryId) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "SubCategory name, URL, image, and category are required.",
        });
        return;
      }

      // Upserting subCategory data
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name,
        image: imageUrl,
        url,
        featured: values.featured ?? false,
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      toast({
        title: data?.id
          ? "SubCategory has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
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

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} SubCategory information.`
              : " Lets create a subCategory. You can edit subCategory later from the subCategories table or the subCategory page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2 flex-1">
                <Label htmlFor="subcategory-name">SubCategory name</Label>
                <Input
                  id="subcategory-name"
                  placeholder="Name"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="subcategory-url">SubCategory url</Label>
                <Input
                  id="subcategory-url"
                  placeholder="/subCategory-url"
                  disabled={isLoading}
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="subcategory-category">Category</Label>
                <select
                  id="subcategory-category"
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
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This SubCategory will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save SubCategory information"
                  : "Create SubCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
