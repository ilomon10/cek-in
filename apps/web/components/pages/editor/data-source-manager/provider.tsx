import { useEditorMaybe } from "@grapesjs/react";
import { DataRecordProps, DataSource } from "grapesjs";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type DataSourceContextValue = {
  isLoading: boolean;
  resources: DataSource[];
  add: (id: string, records: DataRecordProps[]) => void;
  remove: (id: string) => void;
};

const DataSourceContext = createContext<DataSourceContextValue>(null as any);

export const DataSourceProvider: FC<PropsWithChildren> = ({ children }) => {
  const editor = useEditorMaybe();
  const [propState, setPropState] = useState<DataSourceContextValue>({
    isLoading: true,
    resources: [],
    add: () => {},
    remove: () => {},
  });

  useEffect(() => {
    if (!editor) return;
    const { DataSources } = editor;
    const event = DataSources.events.all;
    const up = () => {
      const result = {
        isLoading: false,
        resources: editor.DataSources.getAll(),
        add: (id: string, records: DataRecordProps[]) => {
          DataSources.add({ id, records });
        },
        remove: (id: string) => {
          DataSources.remove(id);
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
    <DataSourceContext.Provider value={propState}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error("`useDataSource()` must be in <DataSourceProvider />");
  }
  return context;
};
