import { DevicesProvider } from "@grapesjs/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

export const DeviceSelector = () => {
  return (
    <DevicesProvider>
      {({ selected, select, devices }) => {
        return (
          <Select value={selected} onValueChange={(value) => select(value)}>
            <SelectTrigger className="ml-1 mr-auto">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem value={String(device.id)} key={device.id}>
                  {device.getName()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </DevicesProvider>
  );
};
