"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormMessage } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { Separator } from "@repo/ui/components/ui/separator";
import { useWithTenant } from "@/components/hooks/use-tenant";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

export const productSchema = z.object({
  name: z.string().min(3),
  descriptions: z.string().optional(),
  price: z.coerce.number().int().min(1),
  currency: z.string(),
  config: z.object({
    type: z.literal("membership"),
    duration_days: z.coerce.number().int().min(1),
    visit_limit: z.coerce.number().int().min(1).nullable().optional(),
    recurring: z.boolean().optional(),
    grace_period_days: z.coerce.number().int().min(1).optional(),
  }),
});

type ProductFormData = z.infer<typeof productSchema>;
type ProductFormInputData = z.input<typeof productSchema>;
type ProductFormOutputData = z.output<typeof productSchema>;

export const MEMBERSHIP_DURATIONS = [
  { label: "1 Day", value: 1 },
  { label: "1 Week", value: 7 },
  { label: "2 Weeks", value: 14 },
  { label: "1 Month", value: 30 },
  { label: "3 Months", value: 30 * 3 },
  { label: "6 Months", value: 30 * 6 },
  { label: "1 Year", value: 356 },
];

export default function ProductCreateMembershipForm() {
  const tenant = useWithTenant();
  const { tenantId } = useParams();
  const router = useRouter();

  const {
    mutate,
    mutation: { isPending },
  } = useCreate<ProductFormData>({ resource: "products" });

  const form = useForm<ProductFormInputData, any, ProductFormOutputData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: isDev ? faker.book.title() : "",
      descriptions: isDev ? faker.lorem.lines(3) : "",
      currency: "IDR",
      price: "",
      config: {
        type: "membership",
        duration_days: 30,
        grace_period_days: undefined,
        recurring: undefined,
        visit_limit: undefined,
      },
    },
  });

  const handleSubmit = (values: ProductFormOutputData) => {
    const result = {
      tenant: tenant.id,
      name: values.name,
      descriptions: values.descriptions,
      productType: values.config.type,
      currency: values.currency,
      price: values.price,
      config: values.config,
    };

    mutate(
      { values: result },
      {
        onSettled(data) {
          if (data?.data) {
            const { id } = data.data as any;
            router.replace(`/orgs/${tenantId}/products/edit/${id}`);
          }
        },
      },
    );
  };

  return (
    <LoadingOverlay loading={isPending}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="pl-12 px-4 flex flex-col gap-5"
        >
          {isDev && JSON.stringify(form.formState.errors)}
          <FormInput
            control={form.control}
            type="input"
            name="name"
            label="Name"
            placeholder="Enter your product name"
          />

          <FormInput
            control={form.control}
            type="selector"
            name="config.duration_days"
            label="Duration Membership"
            options={MEMBERSHIP_DURATIONS}
          />

          <FormInput
            control={form.control}
            type="input"
            name="price"
            label="Price"
            placeholder="Enter your product price"
          />

          <Card className="max-w-lg py-3 gap-3">
            <CardHeader className="px-3">
              <CardTitle>Monthly Visit Limit</CardTitle>
              <CardDescription>
                Limit how many times members can check in per month
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <FormInput
                control={form.control}
                type="input"
                name="config.visit_limit"
              />
            </CardContent>
          </Card>

          <Separator className="max-w-xl" />

          <FormField
            name="config"
            control={form.control}
            render={() => <FormMessage />}
          />

          <FormInput
            control={form.control}
            name="config.visit_limit"
            type="input"
            label="Visit Limit"
            helperText="(optional)"
          />

          <FormInput
            control={form.control}
            name="config.grace_period_days"
            type="input"
            label="Grace Priod Days"
            helperText="(optional)"
          />
          <FormInput
            control={form.control}
            name="config.recurring"
            type="checkbox"
            label="Recurring"
            helperText="(optional)"
          />
          <Separator className="max-w-xl" />

          <FormInput
            control={form.control}
            type="textarea"
            name="descriptions"
            label="Description"
            helperText={"(optional)"}
            placeholder="Enter your product description"
          />

          <div className="flex space-x-2 mt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </LoadingOverlay>
  );
}
