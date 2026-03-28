"use client";

import { Customer, Order, Tenant } from "@/components/providers/payload-types";
import { DollarSignIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { toCurrency } from "@/components/utils/toCurrency";
import { Label } from "@repo/ui/components/ui/label";
import { FormInput } from "../form-input";
import { Form } from "@repo/ui/components/ui/form";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dataProvider } from "@/components/providers/data-provider";
import { useTenant, useWithTenant } from "@/components/hooks/use-tenant";
import { OrderResponse } from "./edit.products.orders";

export default function MemberEditProductOrderPaymentForm({
  order,
}: {
  order: OrderResponse;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button">
          <DollarSignIcon /> Pay Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogForm order={order} />
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  periods: z.number(),
  method: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const DialogForm = ({ order }: { order: OrderResponse }) => {
  const tenant = useWithTenant();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periods: 1,
    },
  });
  const periods = form.watch("periods");
  const handleSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log(values);
    await dataProvider().create({
      resource: "entitlements",
      variables: {
        tenant: (order.tenant as Tenant).id as number,
        customer: (order.customer as Customer).id as number,
        product: product.id,
        orderItem: reqOrderItem.data.id,
        startAt: dayjs(values.startDate, "DD/MM/YYYY").toISOString(),
        endAt: dayjs(values.endDate, "DD/MM/YYYY").toISOString(),
        status: "active",
      },
    });

    await dataProvider().create({
      resource: "payments",
      variables: {
        order: reqOrder.data.id,
        method: values.payment.method,
        status: "paid",
        paidAt: new Date().toISOString(),
      },
    });
  };
  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Mark as Paid</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3">
        <div className="p-3 bg-muted rounded-md flex flex-col gap-1">
          <Label>Total Amount</Label>
          <div className="text-xl font-bold">
            <span className="text-muted-foreground">Rp</span>{" "}
            {toCurrency((order.totalAmount || 0) * periods, null)}
          </div>
          {periods > 1 && (
            <div className="text-muted-foreground text-xs">
              {toCurrency(order.totalAmount)} × {periods} periods
            </div>
          )}
        </div>
        <FormInput
          control={form.control}
          name="periods"
          type="selector"
          label="Number of Periods"
          listClassName="gap-2"
          options={[
            { label: "1x", value: 1 },
            { label: "2x", value: 2 },
            { label: "3x", value: 3 },
          ]}
        />
        <FormInput
          control={form.control}
          name="method"
          type="selector"
          label="Payment Method"
          listClassName="grid-cols-2 gap-2"
          options={[
            { label: "Cash", value: "cash" },
            { label: "Transfer", value: "transfer" },
            { label: "QRIS", value: "qris" },
            { label: "Other", value: "other" },
          ]}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild={true}>
          <Button variant={"ghost"} type="button">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
          Confirm Payment
        </Button>
      </DialogFooter>
    </Form>
  );
};
