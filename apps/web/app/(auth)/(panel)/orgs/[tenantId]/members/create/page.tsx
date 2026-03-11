"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import MemberCreateForm from "@/components/pages/panel/members/create";

export default function TemplateCreatePage() {
  return (
    <CreateView>
      <CreateViewHeader />
      <MemberCreateForm />
    </CreateView>
  );
}
