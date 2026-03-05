import { useEditorMaybe } from "@grapesjs/react";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { VariableState } from "../plugins/variable-manager/class";

type VariableContextValue = {
  isLoading: boolean;
  variable: VariableState;
  set: (path: string, value: VariableState) => void;
  get: (path: string) => any;
  remove: (path: string) => void;
};

const VariableContext = createContext<VariableContextValue>(null as any);

export const VariableProvider: FC<PropsWithChildren> = ({ children }) => {
  const editor = useEditorMaybe();
  const [propState, setPropState] = useState<VariableContextValue>({
    isLoading: true,
    variable: {
      _meta: { label: "Global Data", type: "root" },
      globalData: {
        _meta: {
          type: "group",
        },
      },
    },
    set: () => {},
    get: () => {
      return "" as any;
    },
    remove: () => {},
  });

  useEffect(() => {
    if (!editor) return;
    const { VariableManager } = editor;
    const event = "variable variable:changed";
    const up = () => {
      const result = {
        isLoading: false,
        variable: editor.VariableManager.toJSON(),
        set: (path: string, value: VariableState) => {
          return VariableManager.set(path, value);
        },
        get: (path: string) => {
          return VariableManager.get(path);
        },
        remove: (path: string) => {
          return VariableManager.remove(path);
        },
      };

      setPropState(result);
    };
    editor.on(event, up);
    up();
    return () => {
      editor.off(event, up);
    };
  }, [editor]);

  return (
    <VariableContext.Provider value={propState}>
      {children}
    </VariableContext.Provider>
  );
};

export const useVariable = () => {
  const context = useContext(VariableContext);
  if (!context) {
    throw new Error("`useVariable()` must be in <VariableProvider />");
  }
  return context;
};
