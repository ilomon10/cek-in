"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useForm as useFormDispatch } from "@refinedev/react-hook-form";
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
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { MEMBERSHIP_DURATIONS } from "./create.membership";

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

type ProductFormInputData = z.input<typeof productSchema>;

export default function ProductEditMembershipForm() {
  const tenant = useWithTenant();
  const { tenantId, id } = useParams();
  const router = useRouter();

  const {
    refineCore: {
      onFinish,
      formLoading,
      mutation: { isPending },
    },
    ...form
  } = useFormDispatch({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: isDev ? faker.book.title() : "",
      descriptions: isDev ? faker.lorem.lines(3) : "",
      currency: "IDR",
      price: "",
      config: {
        type: "membership",
        duration_days: "22",
        grace_period_days: undefined,
        recurring: undefined,
        visit_limit: undefined,
      },
    },
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: id as string,
      meta: {
        depth: 1,
      },
    },
  });

  const handleSubmit = (values: ProductFormInputData) => {
    const result = {
      tenant: tenant.id,
      name: values.name,
      descriptions: values.descriptions,
      productType: values.config.type,
      currency: values.currency,
      price: values.price,
      config: values.config,
    };

    onFinish(result);
  };

  return (
    <EditView>
      <EditViewHeader
        actionsSlot={[
          <DeleteButton
            key={"delete-button"}
            redirectTo={`/orgs/${tenantId}/products`}
          />,
        ]}
      />
      <LoadingOverlay loading={formLoading}>
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
                {isPending ? "Submitting..." : "Edit Product"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
