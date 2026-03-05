import { useDisclosure } from "@/components/hooks/use-disclosure";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { PlusIcon } from "lucide-react";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useVariable } from "./provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group";

type AddButtonProps = {
  path: string;
  onSubmit?: () => void;
};

const formSchema = z.object({
  path: z
    .string()
    .min(3)
    .regex(/^[a-z]+(_[a-z]+)*$/, {
      message: "String must be in snake_case format (e.g., 'my_variable_name')",
    }),
  type: z.string(),
  label: z.string().min(3),
});

export const AddButton: FC<AddButtonProps> = ({ path }) => {
  const { variable: _state, set, get } = useVariable();
  const _meta = get(`${path}._meta`);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: "",
      type: "input",
      label: "",
    },
  });
  const [isOpen, { close, toggle }] = useDisclosure(false);

  const handleSubmit = ({
    type,
    label,
    path: newPath,
  }: z.infer<typeof formSchema>) => {
    switch (type) {
      case "select": {
        set(`${path}.${newPath}`, {
          _meta: {
            type,
            label,
            options: ["contoh", "select"],
          },
          value: "new_variable",
        });
        break;
      }
      case "input": {
        set(`${path}.${newPath}`, {
          _meta: {
            type,
            label,
          },
          value: "new_variable",
        });
        break;
      }
      case "group": {
        set(`${path}.${newPath}`, {
          _meta: {
            type,
            label,
          },
        });
        break;
      }
    }
    form.reset();
    close();
  };
  if (_meta.type !== "group") return null;
  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button asChild variant={"ghost"} size={"icon-sm"}>
          <span>
            <PlusIcon />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Variable</DialogTitle>
        </DialogHeader>
        <form id="form-add-variable" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="path"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Path</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>{path}.</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          placeholder="new_var_path"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select Item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="input">Input</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="label"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Label</FieldLabel>
                      <Input
                        {...field}
                        placeholder="New Variable Label"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-add-variable">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
