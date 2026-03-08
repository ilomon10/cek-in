"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  useUpdate,
  useForm as useFormDispatch,
  useApiUrl,
  useList,
} from "@refinedev/core";
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

const mediaSchema = z.object({
  alt: z.string(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export default function MediaEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = useApiUrl();

  const {
    onFinish,
    formLoading,
    mutation: { isPending },
    query,
  } = useFormDispatch<MediaFormData>({
    redirect: "show",
    resource: "media",
    action: "edit",
    id: id as string,
    meta: {
      depth: 1,
    },
  });

  const defaultValues = query?.data?.data as unknown as Media;
  const thumbnailUrl = useMemo(() => {
    const serverOrigin = new URL(apiUrl).origin;
    if (!defaultValues || !defaultValues.thumbnailURL) {
      return undefined;
    }
    const thumbnailUrl = defaultValues.thumbnailURL;
    console.log(defaultValues);
    return `${serverOrigin}${thumbnailUrl}`;
  }, [defaultValues]);

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      alt: "",
    },
  });

  const handleSubmit = (values: MediaFormData) => {
    console.log("Submit", values);
    onFinish({
      alt: values.alt,
    });
  };

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      alt: defaultValues.alt,
    });
  }, [defaultValues]);

  return (
    <EditView>
      <EditViewHeader />
      <LoadingOverlay loading={formLoading || isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-4 flex flex-row-reverse gap-5"
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
                      router.push(`/templates/editor/${defaultValues.id}`);
                    }}
                  >
                    <PencilIcon />
                  </Button>
                </AspectRatio>
              </div>
              <FormInput
                control={form.control}
                type="input"
                name="alt"
                label="Alt"
                placeholder="Enter your template alt"
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
