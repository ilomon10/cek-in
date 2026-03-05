"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate, useList } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { Template } from "@/components/providers/payload-types";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";

const invitationSchema = z.object({
  title: z.string().min(10, "Must contain title"),
  template: z.string(),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

export default function TemplateCreatePage() {
  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<InvitationFormData>({
    resource: "invitations",
  });

  const {
    result: { data: templates },
  } = useList<Template>({ resource: "templates" });

  const templateOptions = templates.map(({ id, title }) => {
    return {
      label: title,
      value: `${id}`,
    };
  });

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      title: isDev ? faker.book.title() : "",
    },
  });

  const handleSubmit = (values: InvitationFormData) => {
    const template = templates.find(
      ({ id }) => `${id}` === values.template
    ) as Template;

    mutate(
      {
        values: {
          title: values.title,
          data: template.data,
        },
      },
      {
        onSettled(data: unknown) {
          const { id } = data as Template;
          router.replace(`/invitations/edit/${id}`);
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
            className="px-4 flex flex-col gap-5"
          >
            <FormInput
              control={form.control}
              type="input"
              name="title"
              label="Title"
              placeholder="Enter your invitation title"
            />

            <FormInput
              control={form.control}
              type="select"
              name="template"
              label="Template"
              placeholder="Choose your template"
              options={templateOptions}
            />

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
