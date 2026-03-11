import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { AutosizeTextarea } from "@repo/ui/components/ui/autosize-textarea";
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import {
  DateFormInput,
  FormInputProps,
  InputFormInput,
  InputMaskFormInput,
  RadioFormInput,
  SelectFormInput,
  SelectorFormInput,
  TagsFormInput,
} from "./types";
import { TagsInput } from "./tags-input";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@repo/ui/components/ui/empty";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { InputMask } from "@repo/ui/components/ui/input-mask";
import { DatePickerInput } from "@repo/ui/components/ui/date-picker-input";

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormInputProps<TFieldValues, TName, TFieldValues>,
) => {
  const {
    control,
    label,
    helperText,
    description,
    name,
    className,
    type,
    loading,
    disabled: _disabled,
    ...rest
  } = props;

  let renderInput: ControllerProps["render"] = (props) => (
    <div {...props}>
      Please add type `{type}` for FormInput {name}
    </div>
  );

  switch (type) {
    case "input": {
      renderInput = ({ field }) => {
        return <Input {...field} value={field.value || ""} {...rest} />;
      };
      break;
    }
    case "input-mask": {
      renderInput = ({ field }) => {
        return <InputMask {...field} {...(rest as InputMaskFormInput)} />;
      };
      break;
    }
    case "file": {
      renderInput = ({ field }) => <Input {...field} {...rest} type="file" />;
      break;
    }
    case "textarea": {
      renderInput = ({ field }) => <AutosizeTextarea {...field} {...rest} />;
      break;
    }
    case "date": {
      const rest = props as DateFormInput;
      renderInput = ({ field }) => (
        <DatePickerInput
          {...rest}
          value={field.value}
          onChange={(v) => field.onChange(v)}
        />
      );
      break;
    }
    case "selector": {
      const { options } = props as SelectorFormInput;
      renderInput = ({ field }) => (
        <div className="grid grid-cols-3 gap-4">
          {options.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant={field.value === value ? "default" : "outline"}
              onClick={() => field.onChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      );
      break;
    }
    case "select": {
      const { options } = props as SelectFormInput;
      renderInput = ({ field }) => (
        <Select onValueChange={(value) => field.onChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={rest.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map(({ label, value }) => (
                  <SelectItem key={value} value={value as string}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectGroup>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>Empty</EmptyTitle>
                    <EmptyDescription>No data found</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      );
      break;
    }
    case "radio": {
      const { options } = props as RadioFormInput;
      renderInput = ({ field }) => (
        <RadioGroup {...field}>
          {options.map(({ label, value }) => (
            <Label>
              <RadioGroupItem
                value={value as string}
                onClick={() => field.onChange(value)}
              />
              {label}
            </Label>
          ))}
        </RadioGroup>
      );
      break;
    }
    case "checkbox": {
      renderInput = ({ field }) => (
        <Label>
          <Checkbox value={field.value} onCheckedChange={field.onChange} />
          {label}
        </Label>
      );
      break;
    }
    case "tags": {
      const { options } = props as TagsFormInput;
      renderInput = ({ field, fieldState }) => {
        const values = (field.value || []) as string[];
        return (
          <TagsInput
            values={values}
            options={options}
            onChange={(v) => {
              field.onChange(v);
            }}
            triggerProps={{
              "aria-invalid": fieldState.invalid,
            }}
            {...rest}
          />
        );
      };
      break;
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={(prop) => {
        return (
          <FormItem className={cn("max-w-lg", className)}>
            {label && (
              <FormLabel>
                {label}
                {helperText && (
                  <span className="text-muted-foreground">{helperText}</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              {loading ? (
                <Skeleton className="h-11 w-full" />
              ) : (
                renderInput(prop as any)
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
