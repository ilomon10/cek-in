"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  useForm as useFormDispatch,
  useApiUrl,
  useList,
  useGo,
} from "@refinedev/core";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLabel } from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { Media, Tag, Template } from "@/components/providers/payload-types";
import { PencilIcon } from "lucide-react";
import { FormInput } from "@/components/pages/panel/form-input";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

const templateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  slug: z.string().readonly(),
  tags: z.array(z.string()),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function TemplateEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = useApiUrl();
  const go = useGo();

  const {
    onFinish,
    formLoading,
    mutation: { isPending },
    query,
  } = useFormDispatch<TemplateFormData, any, any, Template>({
    redirect: false,
    resource: "templates",
    action: "edit",
    id: id as string,
    meta: {
      select: {
        title: true,
        thumbnailAsset: true,
        description: true,
        slug: true,
        tags: true,
      },
      depth: 1,
    },
    onMutationSuccess(data, variables, context, isAutoSave) {
      console.log(data);
      go({
        to: "/templates",
        type: "replace",
      });
    },
  });

  const {
    query: { isFetching: tagsLoading },
    result: { data: tags },
  } = useList<Tag>({
    resource: "tags",
    meta: {
      select: {
        name: true,
        id: true,
      },
    },
  });

  const tagOptions = tags.map((tag) => ({
    label: tag.name,
    value: `${tag.id}`,
  }));

  const defaultValues = query?.data?.data as unknown as Template;
  const thumbnailUrl = useMemo(() => {
    const serverOrigin = new URL(apiUrl).origin;
    if (!defaultValues || !defaultValues.thumbnailAsset) {
      return undefined;
    }
    const thumbnailUrl = (
      (defaultValues.thumbnailAsset || {}) as unknown as Media
    ).url;
    return `${serverOrigin}${thumbnailUrl}`;
  }, [defaultValues]);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      tags: [],
    },
  });

  const handleSubmit = (values: TemplateFormData) => {
    const tags = values.tags.map((tag) => {
      const exist = tagOptions.find(({ value }) => tag == value);
      if (exist) {
        return Number(tag);
      }
      return {
        name: tag,
      };
    });
    onFinish({
      title: values.title,
      slug: values.slug,
      description: values.description,
      tags: tags,
    });
  };

  useEffect(() => {
    if (!defaultValues) return;
    const tags = (defaultValues?.tags as Tag[])?.map(({ id }) => {
      return String(id);
    });
    form.reset({
      title: defaultValues.title,
      slug: defaultValues.slug || "",
      tags: tags || [],
    });
  }, [defaultValues]);

  return (
    <EditView>
      <EditViewHeader
        actionsSlot={[
          <DeleteButton key={"delete-button"} redirectTo="/templates" />,
        ]}
      />
      <LoadingOverlay loading={formLoading || isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-12 flex flex-row-reverse gap-5"
          >
            <div className="flex flex-col grow gap-5">
              <div className="flex flex-col gap-2 w-2xs">
                <FormLabel>Template Preview</FormLabel>
                <AspectRatio className="bg-muted dark:bg-muted-foreground rounded-xl overflow-hidden">
                  <img
                    className="size-full object-contain border"
                    style={{ backgroundImage: "var(--srg-bg-checker)" }}
                    src={
                      thumbnailUrl ||
                      "https://placehold.co/384x480?text=No+preview+yet"
                    }
                  />
                  <Button
                    type="button"
                    size={"icon"}
                    className="absolute bottom-4 right-4 dark:border-2"
                    onClick={() => {
                      router.push(`/templates/editor/${defaultValues.slug}`);
                    }}
                  >
                    <PencilIcon />
                  </Button>
                </AspectRatio>
              </div>
              <FormInput
                control={form.control}
                type="input"
                name="title"
                label="Title"
                placeholder="Enter your template title"
              />
              <FormInput
                control={form.control}
                type="input"
                name="slug"
                label="Slug"
                helperText="(readonly)"
                readOnly
              />
              <FormInput
                control={form.control}
                type="textarea"
                name="description"
                label="Description"
                placeholder="Enter your template description"
              />
              <FormInput
                control={form.control}
                type="tags"
                name="tags"
                label="Tags"
                options={tagOptions}
                loading={tagsLoading}
              />

              <div className="flex space-x-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Template"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
