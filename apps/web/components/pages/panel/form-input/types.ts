import { Control, FieldPath, FieldValues } from "react-hook-form";

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
  label: string;
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
  control: Control<TFieldValues, TName, TTransformedValues>;
};
export type InputFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "input";
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
export type RadioFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = GeneralFormInput<TFieldValues, TName, TTransformedValues> & {
  type: "radio";
  options: Option[];
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
  | GeneralFormInput<TFieldValues, TName, TTransformedValues>
  | InputFormInput<TFieldValues, TName, TTransformedValues>
  | TextareaFormInput<TFieldValues, TName, TTransformedValues>
  | SelectFormInput<TFieldValues, TName, TTransformedValues>
  | RadioFormInput<TFieldValues, TName, TTransformedValues>
  | TagsFormInput<TFieldValues, TName, TTransformedValues>
  | FileFormInput<TFieldValues, TName, TTransformedValues>;
