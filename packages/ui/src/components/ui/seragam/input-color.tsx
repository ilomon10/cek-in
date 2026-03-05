import { FC, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerPreview,
  ColorPickerProps,
  ColorPickerSelection,
} from "@repo/ui/components/ui/shadcn-io/color-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../input-group";

type InputColorProps = ColorPickerProps & {
  placeholder?: string;
};

export const InputColor: FC<InputColorProps> = ({
  onChange,
  value,
  ...colorPickerProps
}) => {
  const v = useMemo(() => {
    console.log(value?.toString());
    return value?.toString();
  }, [value]);

  return (
    <ColorPicker onChange={onChange} defaultValue={value} {...colorPickerProps}>
      <Popover>
        <InputGroup>
          <InputGroupInput
            onChange={(e) => onChange?.(e.target.value)}
            value={v}
            placeholder={"none"}
          />
          <PopoverTrigger asChild={true}>
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <ColorPickerPreview />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
        </InputGroup>
        <PopoverContent className="flex flex-col gap-2 p-2">
          <ColorPickerSelection className="h-20" />
          <div className="flex items-center gap-4">
            <ColorPickerPreview className="size-6" />
            <div className="grid grow gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </ColorPicker>
  );
};
