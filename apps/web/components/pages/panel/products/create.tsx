"use client";

import { Product } from "@/components/providers/payload-types";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { useState } from "react";
import { ProductCreateSelector } from "./create.selector";
import ProductCreateMembershipForm from "./create.membership";

export const ProductCreateForm = () => {
  const [selected, setSelected] = useState<Product["productType"] | null>(null);
  return (
    <CreateView>
      <CreateViewHeader />
      {selected === null && <ProductCreateSelector onSelect={setSelected} />}
      {selected === "membership" && <ProductCreateMembershipForm />}
    </CreateView>
  );
};
