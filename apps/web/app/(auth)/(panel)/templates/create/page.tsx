"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { Template } from "@/components/providers/payload-types";
import { isDev } from "@/components/hooks/utils";
import { fakerID_ID as faker } from "@faker-js/faker";
import { FormInput } from "@/components/pages/panel/form-input";

const templateSchema = z.object({
  title: z.string(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function TemplateCreatePage() {
  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<TemplateFormData>({
    resource: "templates",
  });

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: isDev ? faker.book.title() : "",
    },
  });

  const handleSubmit = (values: TemplateFormData) => {
    mutate(
      {
        values: {
          title: values.title,
        },
      },
      {
        onSettled(data: unknown) {
          const { id } = data as Template;
          router.replace(`/templates/edit/${id}`);
        },
      }
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
              name="title"
              type="input"
              label="Title"
              placeholder="Enter your template title"
            />

            <div className="flex space-x-2 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
