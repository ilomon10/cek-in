"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { useWithTenant } from "@/components/hooks/use-tenant";
import * as z from "zod";
import slugify from "slugify";
import { generateSimpleHash } from "@repo/ui/lib/generate-simple-hash";
import { generateId } from "@repo/ui/lib/generate-id";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { MemberCreateProductSelector } from "./create.product-selector";
import { Separator } from "@repo/ui/components/ui/separator";

export const memberSchema = z.object({
  name: z.string().min(3),
  email: z.email().optional(),
  phone: z.string(),
  startDate: z.string(),

  product: z.number(),
});

type MemberFormData = z.infer<typeof memberSchema>;
type MemberFormInputData = z.input<typeof memberSchema>;
type MemberFormOutputData = z.output<typeof memberSchema>;

export default function MemberCreateForm() {
  const tenant = useWithTenant();
  const { tenantId } = useParams();
  const router = useRouter();

  const {
    mutate,
    mutation: { isPending },
  } = useCreate<MemberFormData>({ resource: "products" });

  const form = useForm<MemberFormInputData, any, MemberFormOutputData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: isDev ? faker.person.firstName() : "",
      phone: isDev ? faker.phone.number() : "",
      email: isDev
        ? `${slugify(faker.person.firstName(), { lower: true })}@example.com`
        : "",
      product: undefined,
      startDate: undefined,
    },
  });

  const handleSubmit = (values: MemberFormOutputData) => {
    const memberId = `CI${generateSimpleHash(generateId(), true)}`;

    const result = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      tenant: tenant.id,
      memberId,
    };

    console.log(values);

    // mutate(
    //   { values: result },
    //   {
    //     onSettled(data) {
    //       if (data?.data) {
    //         const { id } = data.data as any;
    //         router.replace(`/orgs/${tenantId}/products/edit/${id}`);
    //       }
    //     },
    //   },
    // );
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
            name="name"
            type="input"
            label="Name"
            placeholder="Enter name"
          />
          <div className="flex items-start gap-4 max-w-lg">
            <FormInput
              control={form.control}
              name="phone"
              type="input-mask"
              label="Phone"
              className="w-1/2"
              placeholder="Enter phone number"
              mask={{
                mask: [
                  "+00 000-000-000",
                  "+00 000-0000-0000",
                  "+00 000-0000-00000",
                  "+00 000-00000-00000",
                ],
              }}
              description="Example: +62 (Indonesia), +81 (Japan), +1 (USA), +44 (UK)"
            />

            <FormInput
              control={form.control}
              name="email"
              type="input"
              label="Email"
              helperText="(optional)"
              className="w-1/2"
              placeholder="Enter email"
            />
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="product"
            render={({ field, fieldState }) => (
              <Field className="max-w-lg" data-invalid={fieldState.invalid}>
                <FieldLabel>Product</FieldLabel>
                <FieldContent>
                  <MemberCreateProductSelector
                    aria-invalid={fieldState.invalid}
                    value={field.value}
                    onSelect={field.onChange}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Separator />

          <div className="flex items-start gap-4 max-w-lg">
            <FormInput
              control={form.control}
              name="startDate"
              type="date"
              label="Start Date"
              format="DD/MM/YYYY"
              className="w-1/2"
            />
            <FormInput
              control={form.control}
              name="endDate"
              type="date"
              label="Estimate End Date"
              helperText="(generated)"
              format="DD/MM/YYYY"
              className="w-1/2"
              readOnly
            />
          </div>

          <div className="flex space-x-2 mt-4 mb-[25vh]">
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
