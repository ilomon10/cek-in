import { Button } from "@repo/ui/components/ui/button";
import { Progress } from "@repo/ui/components/ui/progress";
import { ArrowLeftIcon } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../form-input";
import { Field, FieldError, FieldLabel } from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { withMask } from "use-mask-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { cn } from "@repo/ui/lib/utils";

const schema = z.object({
  name: z.string().min(3, "Minimal 3 kata"),
  email: z.email().or(z.literal("")).optional(),
  phone: z.string().min(3, "Minimal 3 Angka"),
});

type FormSchemaType = z.infer<typeof schema>;

type TenantOnboardingProps = {
  className?: string;
  onSubmit: (value: FormSchemaType) => void;
};

export const TenantOnboardingStep1: FC<TenantOnboardingProps> = ({
  className,
  onSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit: SubmitHandler<FormSchemaType> = (values) => {
    onSubmit(values);
  };

  return (
    <form
      className={cn("grow flex flex-col justify-center gap-6", className)}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <h1 className="text-2xl font-semibold px-4">Create your Business</h1>
      <div className="px-4 flex flex-col gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-business-name">
                Business Name
              </FieldLabel>
              <Input
                {...field}
                id={"field-business-name"}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-business-email">
                Business Email{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                {...field}
                id={"field-business-email"}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-business-phone">
                Business Phone Number
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+62</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  ref={withMask(["999-9999-9999", "9999-9999-9999"])}
                  id={"field-business-phone"}
                  aria-invalid={fieldState.invalid}
                  placeholder="812-3456-7890"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="px-4">
        <Button type="submit" className="w-full">
          Next
        </Button>
      </div>
    </form>
  );
};

const PHONE_NUMBER_EXTENSIONS_LIST = [
  { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
  { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" },
  { name: "France", code: "FR", dial_code: "+33", flag: "🇫🇷" },
  { name: "Spain", code: "ES", dial_code: "+34", flag: "🇪🇸" },
  { name: "Germany", code: "DE", dial_code: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "IT", dial_code: "+39", flag: "🇮🇹" },
  { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
  { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
];

const PhoneNumberExtensionSelector = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PHONE_NUMBER_EXTENSIONS_LIST.map(({ dial_code, flag, code }) => (
          <SelectItem value={dial_code}>
            {flag}
            <span>{code}</span>
            <span className="text-muted-foreground">{dial_code}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
