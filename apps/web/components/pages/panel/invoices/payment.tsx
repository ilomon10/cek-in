"use client";

import { PHONE_MASK } from "@/components/constants";
import {
  Customer,
  Order,
  OrderItem,
  Payment,
  Product,
  Tenant,
} from "@/components/providers/payload-types";
import {
  GeneralView,
  GeneralViewHeader,
} from "@/components/refine-ui/views/general-view";
import { toCurrency } from "@/components/utils/toCurrency";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Form } from "@repo/ui/components/ui/form";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import dayjs from "dayjs";
import IMask from "imask";
import { DollarSign } from "lucide-react";
import { FC, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { FormInput } from "../form-input";
import { dataProvider } from "@/components/providers/data-provider";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { UndangonLogo } from "../../welcome/header";

const schema = z.object({
  method: z.string(),
});

type SchemaType = z.infer<typeof schema>;

export const InvoicePayment: FC<{
  tenant: Tenant;
  customer: Customer;
  payment: Payment;
  order: Order;
  items: OrderItem[];
}> = (props) => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const form = useForm({ resolver: zodResolver(schema) });

  const { tenant, customer, payment, order, items } = props;
  const router = useRouter();

  const totalAmount = useMemo(
    () =>
      items.reduce((prev, curr) => {
        const quantity = curr.quantity as number;
        const price = curr.price as number;
        return prev + quantity * price;
      }, 0),
    [items],
  );

  const handleSubmit = async (values: SchemaType) => {
    await dataProvider().custom?.({
      method: "post",
      url: `/orders/${order.id}/pay`,
      payload: {
        method: values.method,
        paid: true,
      },
    });
    router.replace(`/orgs/${tenantId}/members/edit/${customer.id}`);
  };

  return (
    <GeneralView className="p-5">
      <Card className="light max-w-2xl mx-auto w-full">
        <div className="px-5 flex">
          <div className="grow">
            <div>Invoice</div>
            <div className="text-2xl font-semibold">{order.invoiceNumber}</div>
          </div>
          <div>
            <UndangonLogo />
          </div>
        </div>
        <Separator />
        <div className="px-5 grid grid-cols-2 gap-2">
          <div>
            <div className="text-muted-foreground">Billed By:</div>
            <div className="text-lg">{tenant.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Billed To:</div>
            <div className="text-lg">{customer.name}</div>
            <div className="text-muted-foreground">
              {IMask.pipe(customer.phone, PHONE_MASK)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Date Issued:</div>
            <div className="text-lg">
              {dayjs(payment.createdAt).format("MMMM DD, YYYY")}
            </div>
          </div>
          {/* <div>
          <div className="text-muted-foreground">Due Date:</div>
          <div className="text-xl">{payment.}</div>
        </div> */}
        </div>
        <div className="px-2">
          <Card className="p-0 bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4 text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="text-muted-foreground">Qty</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const key = `${item.invoiceNumber}-${item.id}`;
                  const product = item.product as Product;
                  return (
                    <TableRow key={key}>
                      <TableCell className="pl-4">
                        <div>{product.name}</div>
                        <div className="capitalize text-muted-foreground">
                          {product.productType}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{toCurrency(item.price)}</TableCell>
                      <TableCell>
                        {toCurrency(
                          (item.quantity as number) * (item.price as number),
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell className="font-semibold">
                    {toCurrency(totalAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="px-5 flex">
          <div className="grow text-xs text-muted-foreground">
            Generated at {dayjs(order.createdAt).format("MMMM DD, YYYY")}
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-semibold">CekIn</span>
          </div>
        </div>
      </Card>

      {order.status === "pending" && (
        <Form {...form}>
          <form
            className="px-5 flex flex-col gap-4 mt-5 max-w-lg mx-auto w-full"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormInput
              control={form.control}
              name="method"
              type="selector"
              label="Payment Method"
              className="max-w-full"
              listClassName="grid-cols-4 gap-2"
              options={[
                { label: "Cash", value: "cash" },
                { label: "Transfer", value: "transfer" },
                { label: "QRIS", value: "qris" },
                { label: "Other", value: "other" },
              ]}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner /> : <DollarSign />}
              Pay Now
            </Button>
          </form>
        </Form>
      )}
    </GeneralView>
  );
};
