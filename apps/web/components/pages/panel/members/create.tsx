"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
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
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { InfinityIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Customer } from "@/components/providers/payload-types";
import slugify from "slugify";
import { generateSimpleHash } from "@repo/ui/lib/generate-simple-hash";
import { generateId } from "@repo/ui/lib/generate-id";
import { Field, FieldContent, FieldLabel } from "@repo/ui/components/ui/field";
import { MemberCreateProductSelector } from "./create.product-selector";

export const memberSchema = z.object({
  name: z.string().min(3),
  email: z.email().optional(),
  phone: z.string(),
  gender: z.string(),
  birthDate: z.string(),

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
      gender: "male",
    },
  });

  const handleSubmit = (values: MemberFormOutputData) => {
    const memberId = `CI${generateSimpleHash(generateId(), true)}`;

    const result = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      gender: values.gender,
      tenant: tenant.id,
      memberId,
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

          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <Field className="max-w-lg">
                <FieldLabel>Paket Membership</FieldLabel>
                <FieldContent>
                  <MemberCreateProductSelector
                    value={field.value}
                    onSelect={field.onChange}
                  />
                </FieldContent>
              </Field>
            )}
          />

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
