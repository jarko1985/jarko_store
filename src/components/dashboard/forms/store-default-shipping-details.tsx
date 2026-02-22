"use client";

// React, Next.js
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { StoreShippingFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Queries
import { updateStoreDefaultShippingDetails } from "@/queries/store";

// Utils
import { useToast } from "@/components/ui/use-toast";

// Types
import { StoreDefaultShippingType } from "@/lib/types";

interface StoreDefaultShippingDetailsProps {
  data?: StoreDefaultShippingType;
  storeUrl: string;
}

const StoreDefaultShippingDetails: FC<StoreDefaultShippingDetailsProps> = ({
  data,
  storeUrl,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof StoreShippingFormSchema>>({
    mode: "onSubmit", // Validate on submit - ensures zod runs before handleSubmit
    resolver: zodResolver(StoreShippingFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available) - use fallbacks to avoid undefined serialization
      defaultShippingService: data?.defaultShippingService ?? "",
      defaultShippingFeePerItem: data?.defaultShippingFeePerItem ?? 0,
      defaultShippingFeeForAdditionalItem:
        data?.defaultShippingFeeForAdditionalItem ?? 0,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg ?? 0,
      defaultShippingFeeFixed: data?.defaultShippingFeeFixed ?? 0,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin ?? 7,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax ?? 31,
      returnPolicy: data?.returnPolicy ?? "",
    },
  });

  const { register, formState: { errors } } = form;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        defaultShippingService: data.defaultShippingService,
        defaultShippingFeePerItem: data.defaultShippingFeePerItem,
        defaultShippingFeeForAdditionalItem: data.defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: data.defaultShippingFeePerKg,
        defaultShippingFeeFixed: data.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: data.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: data.defaultDeliveryTimeMax,
        returnPolicy: data.returnPolicy,
      });
    }
  }, [data, form]);

  // Submit handler for form submission (mirrors category-details handleSubmit logic)
  const handleSubmit = async (
    values: z.infer<typeof StoreShippingFormSchema>
  ) => {
    try {
      const defaultShippingService = String(values.defaultShippingService ?? "").trim();
      const returnPolicy = String(values.returnPolicy ?? "").trim();
      const defaultShippingFeePerItem = Number(values.defaultShippingFeePerItem) ?? 0;
      const defaultShippingFeeForAdditionalItem = Number(values.defaultShippingFeeForAdditionalItem) ?? 0;
      const defaultShippingFeePerKg = Number(values.defaultShippingFeePerKg) ?? 0;
      const defaultShippingFeeFixed = Number(values.defaultShippingFeeFixed) ?? 0;
      const defaultDeliveryTimeMin = Math.round(Number(values.defaultDeliveryTimeMin) ?? 7);
      const defaultDeliveryTimeMax = Math.round(Number(values.defaultDeliveryTimeMax) ?? 31);

      if (!defaultShippingService || !returnPolicy) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Shipping service name and return policy are required.",
        });
        return;
      }

      const response = await updateStoreDefaultShippingDetails(storeUrl, {
        defaultShippingService,
        defaultShippingFeePerItem: Number.isNaN(defaultShippingFeePerItem) ? 0 : defaultShippingFeePerItem,
        defaultShippingFeeForAdditionalItem: Number.isNaN(defaultShippingFeeForAdditionalItem) ? 0 : defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: Number.isNaN(defaultShippingFeePerKg) ? 0 : defaultShippingFeePerKg,
        defaultShippingFeeFixed: Number.isNaN(defaultShippingFeeFixed) ? 0 : defaultShippingFeeFixed,
        defaultDeliveryTimeMin: Number.isNaN(defaultDeliveryTimeMin) ? 7 : Math.max(1, defaultDeliveryTimeMin),
        defaultDeliveryTimeMax: Number.isNaN(defaultDeliveryTimeMax) ? 31 : Math.max(1, defaultDeliveryTimeMax),
        returnPolicy,
      });

      if (response.id) {
        // Displaying success message
        toast({
          title: "Store Default shipping details has been updated.",
        });

        //Refresh data
        router.refresh();
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
          <CardTitle>Store Default Shipping details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errs) => {
                toast({
                  variant: "destructive",
                  title: "Validation Error",
                  description:
                    Object.values(errs)
                      .map((e) => e?.message)
                      .filter(Boolean)
                      .join(". ") || "Please check the form and fix the errors.",
                });
              })}
              className="space-y-4"
            >
              <div className="space-y-2 flex-1">
                <Label htmlFor="shipping-service">Shipping Service name</Label>
                <Input
                  id="shipping-service"
                  placeholder="Name"
                  disabled={isLoading}
                  {...register("defaultShippingService")}
                />
                {errors.defaultShippingService && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.defaultShippingService.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="fee-per-item">Shipping fee per item</Label>
                  <Input
                    id="fee-per-item"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0"
                    disabled={isLoading}
                    className="!pl-1"
                    {...register("defaultShippingFeePerItem")}
                  />
                  {errors.defaultShippingFeePerItem && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultShippingFeePerItem.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="fee-additional">Fee for additional item</Label>
                  <Input
                    id="fee-additional"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0"
                    disabled={isLoading}
                    className="!pl-1"
                    {...register("defaultShippingFeeForAdditionalItem")}
                  />
                  {errors.defaultShippingFeeForAdditionalItem && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultShippingFeeForAdditionalItem.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="fee-per-kg">Shipping fee per kg</Label>
                  <Input
                    id="fee-per-kg"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0"
                    disabled={isLoading}
                    className="!pl-1"
                    {...register("defaultShippingFeePerKg")}
                  />
                  {errors.defaultShippingFeePerKg && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultShippingFeePerKg.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="fee-fixed">Fixed Shipping fee</Label>
                  <Input
                    id="fee-fixed"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0"
                    disabled={isLoading}
                    className="!pl-1"
                    {...register("defaultShippingFeeFixed")}
                  />
                  {errors.defaultShippingFeeFixed && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultShippingFeeFixed.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="delivery-min">Minimum Delivery time (days)</Label>
                  <Input
                    id="delivery-min"
                    type="number"
                    min={1}
                    placeholder="7"
                    disabled={isLoading}
                    {...register("defaultDeliveryTimeMin")}
                  />
                  {errors.defaultDeliveryTimeMin && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultDeliveryTimeMin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 flex-1 min-w-[140px]">
                  <Label htmlFor="delivery-max">Maximum Delivery time (days)</Label>
                  <Input
                    id="delivery-max"
                    type="number"
                    min={1}
                    placeholder="31"
                    disabled={isLoading}
                    {...register("defaultDeliveryTimeMax")}
                  />
                  {errors.defaultDeliveryTimeMax && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.defaultDeliveryTimeMax.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="return-policy">Return policy</Label>
                <Textarea
                  id="return-policy"
                  placeholder="What's the return policy for your store ?"
                  className="p-4"
                  disabled={isLoading}
                  {...register("returnPolicy")}
                />
                {errors.returnPolicy && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.returnPolicy.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "loading..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;
