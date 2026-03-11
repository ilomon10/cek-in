"use client";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { FormInput } from "@/components/pages/panel/form-input";
import { fakerID_ID as faker } from "@faker-js/faker";
import { isDev } from "@/components/hooks/utils";
import { useWithTenant } from "@/components/hooks/use-tenant";
import * as z from "zod";
import slugify from "slugify";
import { generateSimpleHash } from "@repo/ui/lib/generate-simple-hash";
import { generateId } from "@repo/ui/lib/generate-id";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { MemberCreateProductSelector } from "./create.product-selector";
import { Separator } from "@repo/ui/components/ui/separator";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ProductSchema, productSchema } from "../products/product.schema";
import MemberCreateMembershipForm from "./create.membership";
import { memberConfigSchema } from "./member.schema";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Product } from "@/components/providers/payload-types";

export default function MemberCreateForm() {
  const [product, setProduct] = useState<Product | null>(null);
  return (
    <CreateView>
      <CreateViewHeader title="Create new Member" />
      {product === null && (
        <Field className="mx-12 max-w-lg">
          <FieldLabel>Select Product</FieldLabel>
          <FieldContent>
            <MemberCreateProductSelector onSelect={setProduct} />
          </FieldContent>
        </Field>
      )}

      {product?.productType === "membership" && (
        <MemberCreateMembershipForm product={product} />
      )}
    </CreateView>
  );
}
