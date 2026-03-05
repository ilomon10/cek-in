import useSelections from "@/components/hooks/use-selections";
import { useToggle } from "@/components/hooks/use-toggle";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type LeftSidebarContextProps = {
  defaultValue?: string;
};
type LeftSidebarContextValue = {
  selected?: string;
  set: (value?: string) => void;
  toggle: (value: string) => void;
  isSelected: (value: string) => boolean;
};

const LeftSidebarContext = createContext<LeftSidebarContextValue>(null as any);

export const LeftSidebarContextProvider: FC<
  PropsWithChildren<LeftSidebarContextProps>
> = ({ children, defaultValue }) => {
  const [selected, toggle, set] = useToggle(defaultValue);
  const isSelected = (value: string) => selected === value;

  return (
    <LeftSidebarContext.Provider
      value={{
        selected,
        set,
        toggle,
        isSelected,
      }}
    >
      {children}
    </LeftSidebarContext.Provider>
  );
};

export const useLeftSidebarContext = () => {
  const context = useContext(LeftSidebarContext);
  if (!context) {
    throw new Error(
      "`useLeftSidebarContext()` must be inside of `<LeftSidebarContextProvider/>`"
    );
  }
  return context;
};
