"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { Separator } from "@repo/ui/components/ui/separator";
import { useWithTenant } from "@/components/hooks/use-tenant";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { InfinityIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";

export const productSchema = z.object({
  name: z.string().min(3),
  descriptions: z.string().optional(),
  price: z.coerce.number().int().min(1),
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

type ProductFormData = z.infer<typeof productSchema>;
type ProductFormInputData = z.input<typeof productSchema>;
type ProductFormOutputData = z.output<typeof productSchema>;

export const MEMBERSHIP_DURATIONS = [
  { label: "1 Day", value: 1 },
  { label: "1 Week", value: 7 },
  { label: "2 Weeks", value: 14 },
  { label: "1 Month", value: 30 },
  { label: "3 Months", value: 30 * 3 },
  { label: "6 Months", value: 30 * 6 },
  { label: "1 Year", value: 365 },
  { label: "Lifetime", value: -1 },
];

export default function ProductCreateMembershipForm() {
  const tenant = useWithTenant();
  const { tenantId } = useParams();
  const router = useRouter();

  const {
    mutate,
    mutation: { isPending },
  } = useCreate<ProductFormData>({ resource: "products" });

  const form = useForm<ProductFormInputData, any, ProductFormOutputData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: isDev ? faker.book.title() : "",
      descriptions: isDev ? faker.lorem.lines(3) : "",
      currency: "IDR",
      price: "",
      features: [{ title: "Akses penuh area" }, { title: "Check-in QR code" }],
      config: {
        type: "membership",
        duration_days: 30,
        grace_period_days: undefined,
        recurring: undefined,
        visit_limit: -1,
      },
    },
  });

  const featureFields = useFieldArray({
    control: form.control,
    name: "features",
  });

  const handleSubmit = (values: ProductFormOutputData) => {
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

    mutate(
      { values: result },
      {
        onSettled(data) {
          if (data?.data) {
            const { id } = data.data as any;
            router.replace(`/orgs/${tenantId}/products/edit/${id}`);
          }
        },
      },
    );
  };

  return (
    <LoadingOverlay loading={isPending}>
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
                <Button variant={"secondary"} className="max-w-lg">
                  <PlusIcon /> Add Feature
                </Button>
              </FormItem>
            )}
          />

          <div className="flex space-x-2 mt-4 mb-[25vh]">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </LoadingOverlay>
  );
}
