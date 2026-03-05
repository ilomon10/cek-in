"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectTriggerProps,
  SelectValue,
} from "@repo/ui/components/ui/select";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ReactNode;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
];

export function ThemeSelect(props: Omit<SelectTriggerProps, "children">) {
  const { theme, setTheme } = useTheme();

  const currentTheme = themeOptions.find((option) => option.value === theme);

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
      <SelectTrigger {...props}>
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentTheme?.icon}
            <span>{currentTheme?.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-40 space-y-1">
        {themeOptions.map((option) => {
          const isSelected = theme === option.value;

          return (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "flex items-center gap-2 cursor-pointer relative pr-8",
                {
                  "bg-accent text-accent-foreground": isSelected,
                }
              )}
            >
              {option.icon}
              <span>{option.label}</span>
              {isSelected && (
                <Check className="h-4 w-4 absolute right-2 text-primary" />
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

ThemeSelect.displayName = "ThemeSelect";
