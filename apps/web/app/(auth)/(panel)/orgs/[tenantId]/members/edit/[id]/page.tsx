"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  useForm as useFormDispatch,
  useApiUrl,
  useList,
  useGo,
  useParse,
  useParsed,
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
import { Media, Customer } from "@/components/providers/payload-types";
import { PencilIcon } from "lucide-react";
import { FormInput } from "@/components/pages/panel/form-input";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

const customerSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().readonly(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function TemplateEditPage() {
  const router = useRouter();
  const { tenantId, id } = useParams();
  const apiUrl = useApiUrl();
  const go = useGo();

  const {
    onFinish,
    formLoading,
    mutation: { isPending },
    query,
  } = useFormDispatch<CustomerFormData, any, any, Customer>({
    redirect: false,
    resource: "customers",
    action: "edit",
    id: id as string,
    meta: {
      select: {
        memberId: true,
        name: true,
        phone: true,
        email: true,
      },
      depth: 1,
    },
    onMutationSuccess(data) {
      console.log(data);
      go({
        to: "/customers",
        type: "replace",
      });
    },
  });

  const defaultValues = query?.data?.data as unknown as Customer;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const handleSubmit = (values: CustomerFormData) => {
    onFinish({
      name: values.name,
      phone: values.phone,
      email: values.email,
    });
  };

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      name: defaultValues.name,
      phone: defaultValues.phone || "",
      email: defaultValues.email || "",
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
                <FormLabel>Member Badge</FormLabel>
                <AspectRatio className="bg-muted dark:bg-muted-foreground rounded-xl overflow-hidden">
                  <img
                    className="size-full object-contain border"
                    style={{ backgroundImage: "var(--srg-bg-checker)" }}
                    src={"https://placehold.co/384x480?text=No+preview+yet"}
                  />
                  <Button
                    type="button"
                    size={"icon"}
                    className="absolute bottom-4 right-4 dark:border-2"
                    onClick={() => {
                      router.push(`/member-access/${defaultValues.memberId}`);
                    }}
                  >
                    <PencilIcon />
                  </Button>
                </AspectRatio>
              </div>
              <FormInput
                control={form.control}
                type="input"
                name="name"
                label="Name"
                placeholder="Enter name"
              />
              <FormInput
                control={form.control}
                type="input"
                name="phone"
                label="Phone"
                helperText="(readonly)"
                readOnly
              />
              <FormInput
                control={form.control}
                type="input"
                name="email"
                label="Email"
                placeholder="Enter email"
              />

              <div className="flex space-x-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Member"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
