"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  useUpdate,
  useForm as useFormDispatch,
  useApiUrl,
  useList,
} from "@refinedev/core";
// import { useForm } from "react-hook-form";
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
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { Media, Tag, Template } from "@/components/providers/payload-types";
import { PencilIcon } from "lucide-react";
import { FormInput } from "@/components/pages/panel/form-input";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { PreviewButton } from "./preview-button";
import { GoToButton } from "./goto-button";

const invitationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  slug: z.string().readonly(),
  tags: z.array(
    z.union([
      z.string(),
      z.object({
        name: z.string(),
        slug: z.string().optional(),
      }),
    ])
  ),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

export default function TemplateEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = useApiUrl();

  const {
    onFinish,
    formLoading,
    mutation: { isPending },
    query,
  } = useFormDispatch<InvitationFormData>({
    redirect: "show",
    resource: "invitations",
    action: "edit",
    id: id as string,
    meta: {
      select: {
        thumbnailAsset: true,
        title: true,
        description: true,
        slug: true,
        tags: true,
      },
      depth: 1,
    },
  });

  const {
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

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      tags: [],
    },
  });

  const handleSubmit = (values: InvitationFormData) => {
    const tags = values.tags.map((tag) => {
      const exist = tagOptions.find(({ value }) => tag == value);
      if (exist) {
        return Number(tag);
      }
      return {
        name: tag,
      };
    });
    const transform = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      tags,
    };
    onFinish(transform);
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
          <GoToButton
            key={"goto-button"}
            redirectTo={`/i/${defaultValues?.slug}`}
          />,
          <PreviewButton
            key={"preview-button"}
            redirectTo={`/i/${defaultValues?.slug}/preview`}
          />,
          <DeleteButton key={"delete-button"} redirectTo="/invitations" />,
        ]}
      />
      <LoadingOverlay loading={formLoading || isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-4 flex flex-row-reverse gap-5"
          >
            <div className="flex flex-col grow gap-5">
              <div className="flex flex-col gap-2 w-2xs">
                <FormLabel>Invitation Preview</FormLabel>
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
                      router.push(`/invitations/editor/${defaultValues.slug}`);
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
                placeholder="Enter your invitation title"
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
                placeholder="Enter your invitation description"
              />
              <FormInput
                control={form.control}
                type="tags"
                name="tags"
                label="Tags"
                options={tagOptions}
              />

              <div className="flex space-x-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Invitation"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
