"use client";

import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { CalendarIcon } from "lucide-react";

dayjs.extend(customParseFormat);

type DatePickerInputProps = {
  value?: string;
  onChange?: (value: string) => void;

  format?: string;

  id?: string;
  name?: string;
  placeholder?: string;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  id,
  name,
  value: initialValue,
  onChange,
  onBlur,

  format = "YYYY-MM-DD",
  placeholder,

  disabled,
  readOnly,
  required,
}) => {
  const [open, setOpen] = React.useState(false);

  const parsed = React.useMemo(() => {
    if (!initialValue) return undefined;

    const d = dayjs(initialValue, format, true);
    return d.isValid() ? d : undefined;
  }, [initialValue, format]);

  const [date, setDate] = React.useState<dayjs.Dayjs | undefined>(parsed);

  React.useEffect(() => {
    if (!initialValue) return;

    const d = dayjs(initialValue, format, true);
    if (d.isValid()) setDate(d);
  }, [initialValue, format]);

  const inputValue = date ? date.format(format) : "";

  const handleInputChange = (v: string) => {
    if (readOnly || disabled) return;

    const parsed = dayjs(v, format, true);

    if (parsed.isValid()) {
      setDate(parsed);
      onChange?.(parsed.format(format));
    }
  };

  const handleCalendarSelect = (d?: Date) => {
    if (!d || readOnly || disabled) return;

    const parsed = dayjs(d);

    setDate(parsed);
    onChange?.(parsed.format(format));
    setOpen(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (disabled) return;
    setOpen(v);
  };

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        name={name}
        value={inputValue}
        placeholder={placeholder ?? format}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onBlur={onBlur}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !disabled) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />

      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
              disabled={disabled}
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date?.toDate()}
              month={date?.toDate()}
              onMonthChange={(m) => setDate(dayjs(m))}
              onSelect={handleCalendarSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
};
