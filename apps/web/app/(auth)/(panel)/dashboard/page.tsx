import { ChartAreaInteractive } from "@/components/pages/panel/dashboard/chartarea-interactive";
import { SectionCards } from "@/components/pages/panel/dashboard/section-cards";
import {
  GeneralView,
  GeneralViewHeader,
} from "@/components/refine-ui/views/general-view";

export default function DashboardPage() {
  return (
    <GeneralView>
      <GeneralViewHeader
        title="Dashboard"
        enableBackButton={false}
        headerClassName="px-11"
      />
      <SectionCards />
      <div className="p-6">
        <ChartAreaInteractive />
      </div>
    </GeneralView>
  );
}
