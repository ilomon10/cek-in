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
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  DropzoneProps,
} from "@repo/ui/components/ui/dropzone";
import { withMask } from "use-mask-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

const schema = z.object({
  logo: z.string(),
});

type FormSchemaType = z.infer<typeof schema>;

type TenantOnboardingProps = {
  className?: string;
  onSubmit: (file: File) => void;
};

export const TenantOnboardingStep2: FC<TenantOnboardingProps> = ({
  className,
  onSubmit,
}) => {
  const [file, setFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      logo: "",
    },
  });

  const handleSubmit: SubmitHandler<FormSchemaType> = (values) => {
    if (file) onSubmit(file);
  };

  const handleDrop: DropzoneProps["onDrop"] = (value) => {
    if (value[0]) {
      setFile(value[0]);
      setImagePreview(URL.createObjectURL(value[0]));
    }
  };

  return (
    <form
      className={cn("grow flex flex-col justify-center gap-6", className)}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <h1 className="text-2xl font-semibold px-4">Customize your Brand</h1>
      <div className="px-4 flex flex-col gap-4">
        <Controller
          control={form.control}
          name="logo"
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-business-name">Brand Logo</FieldLabel>
              <div className="flex justify-center">
                <Avatar className="size-62">
                  <AvatarImage src={imagePreview} />
                  <AvatarFallback>LOGO</AvatarFallback>
                </Avatar>
              </div>
              <Dropzone
                src={file && [file]}
                onDrop={handleDrop}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg"],
                }}
                maxSize={2 * 1024 * 1024}
                className="w-full"
              >
                <DropzoneContent />
                <DropzoneEmptyState />
              </Dropzone>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="px-4">
        <Button type="submit" className="w-full" disabled={!file}>
          Next
        </Button>
      </div>
    </form>
  );
};
