import { ThemeSelect } from "@/components/refine-ui/theme/theme-select";
import { FormItem } from "@repo/ui/components/ui/form";
import { Label } from "@repo/ui/components/ui/label";

export const ApplicationSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-medium">Application Settings</h3>
      <FormItem className="max-w-md">
        <Label>Change Theme</Label>
        <ThemeSelect className="w-full" />
      </FormItem>
    </div>
  );
};
