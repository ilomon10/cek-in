"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate, useList } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Customer, Product } from "@/components/providers/payload-types";
import { isDev } from "@/components/hooks/utils";
import { fakerID_ID as faker } from "@faker-js/faker";
import { FormInput } from "@/components/pages/panel/form-input";
import slugify from "slugify";
import { useWithTenant } from "@/components/hooks/use-tenant";
import { generateSimpleHash } from "@repo/ui/lib/generate-simple-hash";
import { generateId } from "@repo/ui/lib/generate-id";
import { Label } from "@repo/ui/components/ui/label";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/ui/field";

const memberSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(1),
  email: z.string(),
  gender: z.enum(["male", "female"]),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function TemplateCreatePage() {
  const tenant = useWithTenant();
  const { tenantId } = useParams();

  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<Customer>({
    resource: "customers",
  });

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: async () => {
      return {
        name: isDev ? faker.person.firstName() : "",
        phone: isDev ? faker.phone.number() : "",
        email: isDev
          ? `${slugify(faker.person.firstName(), { lower: true })}@example.com`
          : "",
        gender: "male",
      };
    },
  });

  const { result: products } = useList<Product>({
    resource: "products",
    filters: [
      {
        field: "tenant",
        operator: "eq",
        value: tenant.id,
      },
    ],
  });

  const handleSubmit = (values: MemberFormData) => {
    const memberId = `CI${generateSimpleHash(generateId(), true)}`;

    mutate(
      {
        values: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          gender: values.gender,
          tenant: tenant.id,
          memberId,
        },
      },
      {
        onSettled(data) {
          if (!data) return;
          router.replace(`/orgs/${tenantId}/members/edit/${data.data.id}`);
        },
      },
    );
  };

  return (
    <CreateView>
      <CreateViewHeader />
      <LoadingOverlay loading={isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-12 flex flex-col gap-5"
          >
            <FormInput
              control={form.control}
              name="name"
              type="input"
              label="Name"
              placeholder="Enter name"
            />

            <FormInput
              control={form.control}
              name="phone"
              type="input"
              label="Phone"
              placeholder="Enter phone number"
            />

            <FormInput
              control={form.control}
              name="email"
              type="input"
              label="Email"
              placeholder="Enter email"
            />

            <FormInput
              control={form.control}
              name="gender"
              type="radio"
              label="Gender"
              placeholder="Enter email"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />

            <Field>
              <FieldLabel>Paket Membership</FieldLabel>
              <FieldContent>
                {products.data.map(({ id, name }) => (
                  <div key={id}>{name}</div>
                ))}
              </FieldContent>
            </Field>

            <div className="flex space-x-2 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Member"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
