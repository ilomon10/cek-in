"use client";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import z from "zod";
import { isDev } from "@/components/hooks/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useFormDispatch } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
import { useWithTenant } from "@/components/hooks/use-tenant";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Form } from "@repo/ui/components/ui/form";
import { FormInput } from "../form-input";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import MemberEditProductsForm from "./edit.products";
import MemberEditProductsOrdersForm from "./edit.products.orders";

export const memberSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  email: z.email().optional(),
  phone: z.string(),
});

type MemberFormData = z.input<typeof memberSchema>;
type MemberFormInputData = z.input<typeof memberSchema>;
type MemberFormOutputData = z.output<typeof memberSchema>;

export default function MemberEditForm() {
  const tenant = useWithTenant();
  const { id } = useParams();
  // const router = useRouter();

  const {
    refineCore: {
      onFinish,
      formLoading,
      mutation: { isPending },
    },
    ...form
  } = useFormDispatch({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      id: undefined,
      name: "",
      phone: "",
      email: "",
    },
    refineCoreProps: {
      action: "edit",
      id: id as string,
      meta: {
        depth: 1,
      },
    },
  });

  const memberId = form.watch("id");

  const handleSubmit = (values: MemberFormInputData) => {
    console.log(values);
    const result = {
      tenant: tenant.id,
      name: values.name,
      phone: values.phone,
      email: values.email,
    };

    onFinish(result as any);
  };

  return (
    <EditView>
      <EditViewHeader title="Edit Member" />
      <LoadingOverlay loading={formLoading}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="pl-12 px-4 flex flex-col gap-5 mb-4"
          >
            {isDev && JSON.stringify(form.formState.errors)}

            <FormInput
              control={form.control}
              name="name"
              type="input"
              label="Name"
              placeholder="Enter name"
            />
            <div className="flex items-start gap-4 max-w-lg">
              <FormInput
                control={form.control}
                name="phone"
                type="input-mask"
                label="Phone"
                className="w-1/2"
                placeholder="Enter phone number"
                mask={{
                  mask: [
                    "+00 000-000-000",
                    "+00 000-0000-0000",
                    "+00 000-0000-00000",
                    "+00 000-00000-00000",
                  ],
                }}
                description="Example: +62 (Indonesia), +81 (Japan), +1 (USA), +44 (UK)"
              />

              <FormInput
                control={form.control}
                name="email"
                type="input"
                label="Email"
                helperText="(optional)"
                className="w-1/2"
                placeholder="Enter email"
              />
            </div>

            <div className="flex space-x-2 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Change"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>

      <Separator />
      <MemberEditProductsForm />
      <MemberEditProductsOrdersForm />

      <div className="h-[25vh]" />
    </EditView>
  );
}
