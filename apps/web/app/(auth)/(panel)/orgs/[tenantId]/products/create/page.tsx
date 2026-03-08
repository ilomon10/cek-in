"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate, useList } from "@refinedev/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { Product } from "@/components/providers/payload-types";
import { Field } from "@repo/ui/components/ui/field";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

const productSchema = z.object({
  name: z.string().min(3, "Must contain name"),
  descriptions: z.string(),
  productType: z.string(),
  price: z.number(),
  currency: z.string(),
  config: z.json(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductCreatePage() {
  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<ProductFormData>({
    resource: "product",
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: isDev ? faker.book.title() : "",
      descriptions: isDev ? faker.lorem.lines(2) : "",
      productType: "membership",
      currency: "IDR",
      price: 0,
    },
  });

  const productType = form.watch("productType");

  const handleSubmit = (values: ProductFormData) => {
    mutate(
      {
        values: {
          name: values.name,
          descriptions: values.descriptions,
          productType: values.productType,
          currency: values.currency,
          price: values.price,
        },
      },
      {
        onSettled(data: unknown) {
          const { id } = data as Product;
          router.replace(`products/edit/${id}`);
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
            className="px-4 flex flex-col gap-5"
          >
            <FormInput
              control={form.control}
              type="input"
              name="name"
              label="Name"
              placeholder="Enter your product name"
            />

            <FormInput
              control={form.control}
              type="input"
              name="descriptions"
              label="Description"
              placeholder="Enter your product description"
            />

            <FormInput
              control={form.control}
              type="input"
              name="price"
              label="Price"
              placeholder="Enter your product description"
            />

            <FormInput
              control={form.control}
              type="select"
              name="type"
              label="Type"
              placeholder="Choose your product type"
              options={[
                { label: "Membership", value: "membership" },
                { label: "Event", value: "event" },
                { label: "Package", value: "package" },
              ]}
            />

            {productType === "membership" && (
              <FormInput
                control={form.control}
                name="config.recurring"
                type="checkbox"
                label="Recurring"
              />
            )}

            <div className="flex space-x-2 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
