"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Coupon } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { CouponFormSchema } from "@/lib/schemas";

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
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Queries
import { upsertCoupon } from "@/queries/coupon";

// Utils
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Helper: format for datetime-local input (YYYY-MM-DDTHH:mm) and storage (YYYY-MM-DDTHH:mm:ss)
const toDateTimeLocal = (value: string | Date | undefined): string => {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toStorageFormat = (value: string): string => {
  if (!value) return "";
  // datetime-local returns YYYY-MM-DDTHH:mm, append :00 for seconds
  return value.length === 16 ? `${value}:00` : value;
};

interface CouponDetailsProps {
  data?: Coupon;
  storeUrl: string;
}

const CouponDetails: FC<CouponDetailsProps> = ({ data, storeUrl }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const now = new Date();
  const defaultStart = toDateTimeLocal(now);
  const defaultEnd = toDateTimeLocal(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)); // +30 days

  const form = useForm<z.infer<typeof CouponFormSchema>>({
    mode: "onSubmit", // Validate on submit - ensures zod runs before handleSubmit
    resolver: zodResolver(CouponFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available) - datetime-local format (YYYY-MM-DDTHH:mm)
      code: data?.code ?? "",
      discount: data?.discount ?? 1,
      startDate: data?.startDate ? toDateTimeLocal(data.startDate) : defaultStart,
      endDate: data?.endDate ? toDateTimeLocal(data.endDate) : defaultEnd,
    },
  });

  const { register, formState: { errors } } = form;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes (normalize to datetime-local format)
  useEffect(() => {
    if (data) {
      form.reset({
        code: data.code,
        discount: data.discount,
        startDate: toDateTimeLocal(data.startDate),
        endDate: toDateTimeLocal(data.endDate),
      });
    }
  }, [data, form]);

  // Submit handler for form submission (mirrors category-details handleSubmit logic)
  const handleSubmit = async (values: z.infer<typeof CouponFormSchema>) => {
    try {
      const code = String(values.code ?? "").trim();
      const discountNum = Number(values.discount);
      const discount = Number.isNaN(discountNum) || discountNum < 1 || discountNum > 99
        ? 1
        : Math.round(discountNum);
      const startDate = toStorageFormat(values.startDate || defaultStart);
      const endDate = toStorageFormat(values.endDate || defaultEnd);

      // Upserting coupon data
      const response = await upsertCoupon(
        {
          id: data?.id ? data.id : v4(),
          code,
          discount,
          startDate,
          endDate,
          storeId: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );

      // Displaying success message
      toast({
        title: data?.id
          ? "Coupon has been updated."
          : `Congratulations! '${response?.code}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/coupons`);
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
          <CardTitle>Coupon Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.code} coupon information.`
              : " Lets create a coupon. You can edit coupon later from the coupons table or the coupon page."}
          </CardDescription>
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
                <Label htmlFor="coupon-code">Coupon code</Label>
                <Input
                  id="coupon-code"
                  placeholder="Coupon"
                  disabled={isLoading}
                  {...register("code")}
                />
                {errors.code && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-discount">Coupon discount (%)</Label>
                <Input
                  id="coupon-discount"
                  type="number"
                  min={1}
                  max={99}
                  placeholder="1-99"
                  disabled={isLoading}
                  {...register("discount", { valueAsNumber: true })}
                />
                {errors.discount && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.discount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-startdate">Start date</Label>
                <Input
                  id="coupon-startdate"
                  type="datetime-local"
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-enddate">End date</Label>
                <Input
                  id="coupon-enddate"
                  type="datetime-local"
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save coupon information"
                  : "Create coupon"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CouponDetails;
