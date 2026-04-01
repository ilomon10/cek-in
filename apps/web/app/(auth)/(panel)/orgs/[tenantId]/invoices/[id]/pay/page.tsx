import { InvoicePayment } from "@/components/pages/panel/invoices/payment";
import {
  Customer,
  Order,
  OrderItem,
  Payment,
  Tenant,
} from "@/components/providers/payload-types";
import { serverDataProvider } from "@/components/providers/server-side-data-provider";
import { cookies } from "next/headers";
import { PaginatedDocs } from "payload";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>;
}) {
  const kukis = await cookies();
  const currentJwt = kukis.get("payload-token")?.value;

  const { id: orderId } = await params;
  const requestInit = {
    headers: { Authorization: `JWT ${currentJwt}` },
  };
  const { data: order } = await serverDataProvider({
    config: requestInit,
  }).getOne<Order>({
    resource: "orders",
    id: orderId,
    meta: {
      depth: 2,
    },
  });

  const payment = order.payments?.docs?.[0] as Payment;

  return (
    <InvoicePayment
      payment={payment}
      order={order}
      customer={order.customer as Customer}
      tenant={order.tenant as Tenant}
      items={(order.items as PaginatedDocs<OrderItem>).docs || []}
    />
  );
}
