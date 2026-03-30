"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  useCreate,
  useCustom,
  useCustomMutation,
  type CustomResponse,
} from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { useWithTenant } from "@/components/hooks/use-tenant";
import * as z from "zod";
import slugify from "slugify";
import { generateSimpleHash } from "@repo/ui/lib/generate-simple-hash";
import { generateId } from "@repo/ui/lib/generate-id";
import { Separator } from "@repo/ui/components/ui/separator";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Customer,
  MembershipConfig,
  Product,
} from "@/components/providers/payload-types";
import { Button } from "@repo/ui/components/ui/button";
import { toCurrency } from "@/components/utils/toCurrency";
import { MemberCreatePayment } from "./create.payment";
import {
  Item,
  ItemHeader,
  ItemTitle,
  ItemContent,
} from "@repo/ui/components/ui/item";
import { cn } from "@repo/ui/lib/utils";
import { dataProvider } from "@/components/providers/data-provider";

const paymentSchema = z.discriminatedUnion("paid", [
  z.object({
    paid: z.literal(true),
    method: z.string(),
  }),
  z.object({
    paid: z.literal(false),
    method: z.string().optional(),
  }),
]);

export const memberSchema = z.object({
  name: z.string().min(3),
  email: z.email().optional(),
  phone: z.string(),
  startDate: z.string(),
  endDate: z.string(),

  payment: paymentSchema,
});

type MemberFormData = z.infer<typeof memberSchema>;
type MemberFormInputData = z.input<typeof memberSchema>;
type MemberFormOutputData = z.output<typeof memberSchema>;

export default function MemberCreateMembershipForm({
  product,
}: {
  product: Product;
}) {
  const tenant = useWithTenant();
  const { tenantId } = useParams();
  const router = useRouter();
  const config = product.config as MembershipConfig;

  const {
    mutate,
    mutation: { isPending },
  } = useCustomMutation<MemberFormData>();

  const form = useForm<MemberFormInputData, any, MemberFormOutputData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: isDev ? faker.person.firstName() : "",
      phone: isDev
        ? faker.phone.number({
            style: "international",
          })
        : "",
      email: isDev
        ? `${slugify(faker.person.firstName(), { lower: true })}@example.com`
        : "",
      startDate: dayjs().format("DD/MM/YYYY"),
      endDate: undefined,

      payment: {
        paid: false,
      },
    },
  });

  const handleSubmit = async (values: MemberFormOutputData) => {
    const result = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      tenant: tenant.id,
      product: product.id,
    };

    mutate(
      {
        method: "post",
        url: "/membership/create",
        values: result,
      },
      {
        async onSettled(_data) {
          const {
            data: { data },
          } = _data as CustomResponse;
          await dataProvider().custom?.({
            method: "post",
            url: `/orders/${data.orderId}/pay`,
            payload: {
              method: values.payment.method,
              paid: values.payment.paid,
            },
          });
          router.replace(`/orgs/${tenantId}/members/edit/${data.customerId}`);
        },
      },
    );
  };

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const paymentPaid = form.watch("payment.paid");
  const paymentMethod = form.watch("payment.method");

  const isSummary = startDate;

  useEffect(() => {
    if (!startDate) return;
    if (config.duration_days > 0) {
      form.setValue(
        "endDate",
        dayjs(startDate, "DD/MM/YYYY")
          .add(config.duration_days, "day")
          .format("DD/MM/YYYY"),
      );
    } else {
      form.setValue(
        "endDate",
        dayjs("31/12/9999", "DD/MM/YYYY").format("DD/MM/YYYY"),
      );
    }
  }, [product, startDate]);

  const SUMMARY_VALUES = useMemo(() => {
    const color = paymentPaid ? "text-green-500" : "text-yellow-500";

    const result = [
      { label: "Product", value: product.name },
      { label: "Duration", value: `${product.config?.duration_days} days` },
      { label: "Applies Until", value: endDate },
      {
        label: "Payment Status",
        value: (
          <span className={color}>{paymentPaid ? "Paid" : "Waiting"}</span>
        ),
      },
    ];

    if (paymentPaid) {
      result.push({
        label: "Method",
        value: paymentMethod?.toUpperCase() || "-",
      });
    }

    result.push({
      label: "Price",
      value: (
        <span className={cn(color, "text-lg")}>
          {toCurrency(product.price)}
        </span>
      ),
    });

    return result;
  }, [startDate, endDate, paymentPaid, paymentMethod]);

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

          <Separator className="max-w-xl" />

          <div className="max-w-lg">
            <Button
              type="button"
              variant={"outline"}
              className="size-full justify-start text-left"
            >
              <span className="flex flex-col items-start gap-2">
                <span className="font-semibold text-md">{product.name}</span>
                <span className="flex flex-col">
                  <span className="capitalize text-xs">Membership</span>
                  <span className="font-semibold text-md">
                    {config.duration_days > -1
                      ? `Duration ${config.duration_days} days`
                      : "Unlimited"}
                  </span>
                </span>
                <span className="font-semibold text-lg">
                  {toCurrency(product.price)}
                </span>
              </span>
            </Button>
          </div>

          <div className="flex items-start gap-4 max-w-lg">
            <FormInput
              control={form.control}
              name="startDate"
              type="date"
              label="Start Date"
              format="DD/MM/YYYY"
              className="w-1/2"
            />
            <FormInput
              control={form.control}
              name="endDate"
              type="date"
              label="Estimate End Date"
              helperText="(generated)"
              format="DD/MM/YYYY"
              className="w-1/2"
              readOnly
            />
          </div>

          <Separator className="max-w-xl" />

          <MemberCreatePayment />

          {isSummary && (
            <Item
              variant={"outline"}
              className={cn(
                "max-w-lg",
                paymentPaid ? "border-green-500" : "border-yellow-500",
              )}
            >
              <ItemHeader>
                <ItemTitle className="font-bold">Summary</ItemTitle>
              </ItemHeader>
              <ItemContent className="gap-2">
                {SUMMARY_VALUES.map(({ label, value }, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="text-muted-foreground">{label}</div>
                    <div className="font-semibold">{value}</div>
                  </div>
                ))}
              </ItemContent>
            </Item>
          )}

          <div className="flex space-x-2 mt-4 mb-[25vh]">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Member"}
            </Button>
          </div>
        </form>
      </Form>
    </LoadingOverlay>
  );
}
