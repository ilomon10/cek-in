import { FactoryOpts } from "imask";
import { MaskOptions } from "maska";
import { FieldPath, FieldValues } from "react-hook-form";

export type Option = {
  label: string;
  value: string | number;
};

export type GeneralFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  type: string;
  className?: string;
  label?: string;
  helperText?: string;
  description?: string;
  name: TName;
  readOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  // defaultValue?: string;
  placeholder?: string;
  // onChange?: (value: string | number) => void;
  // value: string;
  control: any;
};
export type InputFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "input";
};
export type InputMaskFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "input-mask";
  mask: FactoryOpts;
};

export type TextareaFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "textarea";
};

export type SelectFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "select";
  options: Option[];
};

export type SelectorFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "selector";
  options: Option[];

  listClassName?: string;
};

export type DateFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "date";
  format: string;
};

export type RadioFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "radio";
  options: Option[];
};

export type CheckboxFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "checkbox";
};

export type FileFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "file";
};

export type TagsFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "tags";
  options: Option[];
};

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> =
  | CheckboxFormInput<TFieldValues, TName, TTransformedValues>
  | DateFormInput<TFieldValues, TName, TTransformedValues>
  | FileFormInput<TFieldValues, TName, TTransformedValues>
  | GeneralFormInput<TFieldValues, TName, TTransformedValues>
  | InputFormInput<TFieldValues, TName, TTransformedValues>
  | InputMaskFormInput<TFieldValues, TName, TTransformedValues>
  | RadioFormInput<TFieldValues, TName, TTransformedValues>
  | SelectFormInput<TFieldValues, TName, TTransformedValues>
  | SelectorFormInput<TFieldValues, TName, TTransformedValues>
  | TagsFormInput<TFieldValues, TName, TTransformedValues>
  | TextareaFormInput<TFieldValues, TName, TTransformedValues>;
