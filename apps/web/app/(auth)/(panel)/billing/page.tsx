import {
  GeneralView,
  GeneralViewHeader,
} from "@/components/refine-ui/views/general-view";

export default function BillingPage() {
  return (
    <GeneralView>
      <GeneralViewHeader
        title="Billing"
        enableBackButton={false}
        headerClassName="px-11"
      />
      <div>this is Billing page</div>
    </GeneralView>
  );
}
