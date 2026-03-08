"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
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
import { Media, Template } from "@/components/providers/payload-types";
import { isDev } from "@/components/hooks/utils";
import { fakerID_ID as faker } from "@faker-js/faker";

const mediaSchema = z.object({
  title: z.string(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export default function MediaCreatePage() {
  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<MediaFormData>({
    resource: "media",
  });

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: isDev ? faker.book.title() : "",
    },
  });

  const handleSubmit = (values: MediaFormData) => {
    mutate(
      {
        values: {
          title: values.title,
        },
      },
      {
        onSettled(data: unknown) {
          const { id } = data as Media;
          router.replace(`/media/edit/${id}`);
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your template title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end space-x-2">
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
