import * as React from "react";
import { useEffect, useRef } from "react";
import IMask, { FactoryOpts } from "imask";

import { cn } from "@repo/ui/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Input } from "./input";

const inputMaskVariants = cva("", {
  variants: {
    size: {
      default: "h-9",
      sm: "h-8",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type InputMaskProps = {
  mask: FactoryOpts;
} & React.ComponentProps<"input"> &
  VariantProps<typeof inputMaskVariants>;

function InputMask({
  mask,
  className,
  size,
  value,
  onChange,
  ...props
}: InputMaskProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<IMask.InputMask<any>>(undefined);

  useEffect(() => {
    if (!inputRef.current) return;

    maskRef.current = IMask(inputRef.current, mask);

    maskRef.current.on("accept", () => {
      const raw = maskRef.current?.unmaskedValue ?? "";

      if (onChange) {
        const event = {
          target: { value: raw },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(event);
      }
    });

    return () => maskRef.current?.destroy();
  }, [mask]);

  useEffect(() => {
    if (!maskRef.current) return;

    maskRef.current.unmaskedValue = String(value ?? "");
  }, [value]);

  return (
    <Input
      {...props}
      ref={inputRef}
      className={cn(inputMaskVariants({ size }), className)}
    />
  );
}

export { InputMask };
