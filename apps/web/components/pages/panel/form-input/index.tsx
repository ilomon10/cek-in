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
import { Textarea } from "@repo/ui/components/ui/textarea";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormInputProps,
  RadioFormInput,
  SelectFormInput,
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

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormInputProps<TFieldValues, TName, TFieldValues>
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
    <div {...props}>Please add type for FormInput {name}</div>
  );
  switch (type) {
    case "input": {
      renderInput = ({ field }) => {
        return <Input {...field} value={field.value || ""} {...rest} />;
      };
      break;
    }
    case "file": {
      renderInput = ({ field }) => <Input {...field} {...rest} type="file" />;
      break;
    }
    case "textarea": {
      renderInput = ({ field }) => <Textarea {...field} {...rest} />;
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
            <RadioGroupItem value={value as string}>{label}</RadioGroupItem>
          ))}
        </RadioGroup>
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
          <FormItem className={cn("w-lg", className)}>
            <FormLabel>
              {label}
              {helperText && <FormDescription>{helperText}</FormDescription>}
            </FormLabel>
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
