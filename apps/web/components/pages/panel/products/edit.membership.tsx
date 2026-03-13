"use client";

import { useWithTenant } from "@/components/hooks/use-tenant";
import { isDev } from "@/components/hooks/utils";
import { FormInput } from "@/components/pages/panel/form-input";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { fakerID_ID as faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useFormDispatch } from "@refinedev/react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { Separator } from "@repo/ui/components/ui/separator";
import { InfinityIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import * as z from "zod";
import { MEMBERSHIP_DURATIONS } from "./create.membership";

export const productSchema = z.object({
  name: z.string().min(3),
  descriptions: z.string().optional(),
  price: z.coerce.number().int().min(1),
  // price: z.string(),
  currency: z.string(),
  features: z.array(
    z.object({
      title: z.string(),
    }),
  ),
  config: z.object({
    type: z.literal("membership"),
    duration_days: z.coerce.number().int().min(-1),
    visit_limit: z.coerce.number().int().min(-1).nullable().optional(),
    recurring: z.boolean().optional(),
    grace_period_days: z.coerce.number().int().min(1).optional(),
  }),
});

type ProductFormInputData = z.input<typeof productSchema>;

export default function ProductEditMembershipForm() {
  const tenant = useWithTenant();
  const { tenantId, id } = useParams();
  const router = useRouter();

  const {
    refineCore: {
      onFinish,
      formLoading,
      mutation: { isPending },
    },
    ...form
  } = useFormDispatch({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: isDev ? faker.book.title() : "",
      descriptions: isDev ? faker.lorem.lines(3) : "",
      currency: "IDR",
      price: "",
      config: {
        type: "membership",
        duration_days: "22",
        grace_period_days: undefined,
        recurring: undefined,
        visit_limit: undefined,
      },
    },
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: id as string,
      meta: {
        depth: 1,
      },
    },
  });

  const featureFields = useFieldArray({
    control: form.control,
    name: "features",
  });

  const handleSubmit = (values: ProductFormInputData) => {
    const result = {
      tenant: tenant.id,
      name: values.name,
      descriptions: values.descriptions,
      productType: values.config.type,
      currency: values.currency,
      price: values.price,
      config: values.config,
      features: values.features,
    };

    onFinish(result);
  };

  return (
    <EditView>
      <EditViewHeader
        actionsSlot={[
          <DeleteButton
            key={"delete-button"}
            redirectTo={`/orgs/${tenantId}/products`}
          />,
        ]}
      />
      <LoadingOverlay loading={formLoading}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="pl-12 px-4 flex flex-col gap-5"
          >
            {isDev && JSON.stringify(form.formState.errors)}
            <FormInput
              control={form.control}
              type="input"
              name="name"
              label="Name"
              placeholder="Enter your product name"
            />

            <FormInput
              control={form.control}
              type="selector"
              name="config.duration_days"
              label="Duration Membership"
              options={MEMBERSHIP_DURATIONS}
            />

            <FormInput
              control={form.control}
              type="input-mask"
              name="price"
              label="Price"
              placeholder="Enter your product price"
              mask={{
                mask: "Rp num",
                blocks: {
                  num: {
                    mask: Number,
                    thousandsSeparator: ".",
                    scale: 0,
                  },
                },
              }}
            />

            <FormField
              control={form.control}
              name="config.visit_limit"
              render={({ field }) => {
                const isChecked = field.value != -1;
                const handleChange = (value: boolean) => {
                  field.onChange(value ? 10 : -1);
                };
                return (
                  <Card className="max-w-lg py-3 gap-3">
                    <label htmlFor="form-config_visit_limit">
                      <CardHeader className="px-3">
                        <CardTitle className="flex text-sm items-center font-semibold">
                          <Checkbox
                            id={"form-config_visit_limit"}
                            className="mr-2"
                            checked={isChecked}
                            onCheckedChange={handleChange}
                          />
                          <span>This product has Monthly Visit Limit</span>
                        </CardTitle>
                        <CardDescription>
                          Limit how many times members can check in per month
                        </CardDescription>
                      </CardHeader>
                    </label>
                    <CardContent className="px-3">
                      {isChecked ? (
                        <FormInput
                          control={form.control}
                          type="input"
                          name="config.visit_limit"
                        />
                      ) : (
                        <InputGroup className="text-purple-300 bg-purple-200 border-purple-500">
                          <InputGroupAddon className="text-purple-500">
                            <InfinityIcon />
                          </InputGroupAddon>
                          <InputGroupInput
                            defaultValue="Members can check-in in indefinitely per month"
                            readOnly
                          />
                        </InputGroup>
                      )}
                    </CardContent>
                  </Card>
                );
              }}
            />

            <Separator className="max-w-xl" />

            <FormInput
              control={form.control}
              type="textarea"
              name="descriptions"
              label="Description"
              helperText={"(optional)"}
              placeholder="Enter your product description"
            />

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  {featureFields.fields.map((field, index) => {
                    return (
                      <FormField
                        key={`features.${index}.title`}
                        control={form.control}
                        name={`features.${index}.title`}
                        render={() => (
                          <InputGroup className="max-w-lg">
                            <InputGroupInput
                              {...form.register(`features.${index}.title`)}
                            />
                            <InputGroupButton
                              onClick={() => featureFields.remove(index)}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroup>
                        )}
                      />
                    );
                  })}
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="max-w-lg"
                    onClick={() =>
                      featureFields.append({ title: "Type something." })
                    }
                  >
                    <PlusIcon /> Add Feature
                  </Button>
                </FormItem>
              )}
            />

            <div className="flex space-x-2 mt-4 mb-[25vh]">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? "Submitting..." : "Edit Product"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
