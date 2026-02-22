"use client";

// React, Next.js
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import { Store } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { StoreFormSchema } from "@/lib/schemas";

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
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";

// Queries
import { upsertStore } from "@/queries/store";

// Utils
import { v4 } from "uuid";

interface StoreDetailsProps {
  data?: Store;
}

const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(StoreFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available) - use empty strings for new to avoid undefined serialization
      name: data?.name ?? "",
      description: data?.description ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
      status: data?.status?.toString() ?? "PENDING",
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
        description: data.description,
        email: data.email,
        phone: data.phone,
        logo: [{ url: data.logo }],
        cover: [{ url: data.cover }],
        url: data.url,
        featured: data.featured,
        status: data.status.toString(),
      });
    }
  }, [data, form]);

  // Submit handler for form submission (mirrors category-details handleSubmit logic)
  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    try {
      const name = String(values.name ?? "").trim();
      const description = String(values.description ?? "").trim();
      const email = String(values.email ?? "").trim();
      const phone = String(values.phone ?? "").trim();
      const url = String(values.url ?? "").trim();
      const logoUrl = values.logo?.[0]?.url ?? "";
      const coverUrl = values.cover?.[0]?.url ?? "";

      if (!name || !description || !email || !phone || !url || !logoUrl || !coverUrl) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Name, description, email, phone, URL, logo, and cover are required.",
        });
        return;
      }

      // Upserting store data
      const response = await upsertStore({
        id: data?.id ? data.id : v4(),
        name,
        description,
        email,
        phone,
        logo: logoUrl,
        cover: coverUrl,
        url,
        featured: values.featured ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      toast({
        title: data?.id
          ? "Store has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${response.url}`);
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
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information.`
              : " Lets create a store. You can edit store later from the store settings page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Logo - Cover */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
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
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
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
              </div>
              {/* Name */}
              <div className="space-y-2 flex-1">
                <Label htmlFor="store-name">Store name</Label>
                <Input
                  id="store-name"
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
              {/* Description */}
              <div className="space-y-2 flex-1">
                <Label htmlFor="store-description">Store description</Label>
                <Textarea
                  id="store-description"
                  placeholder="Description"
                  disabled={isLoading}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
              {/* Email - Phone */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="store-email">Store email</Label>
                  <Input
                    id="store-email"
                    placeholder="Email"
                    type="email"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="store-phone">Store phone</Label>
                  <Input
                    id="store-phone"
                    placeholder="Phone"
                    disabled={isLoading}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="store-url">Store url</Label>
                <Input
                  id="store-url"
                  placeholder="/store-url"
                  disabled={isLoading}
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.url.message}
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
                        This Store will appear on the home page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save store information"
                  : "Create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
