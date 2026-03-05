import { FC } from "react";
import { DataSourceProvider, useDataSource } from "./provider";
import { useEditorMaybe, WithEditor } from "@grapesjs/react";
import { Button } from "@repo/ui/components/ui/button";
import { ClipboardIcon, PlusIcon } from "lucide-react";
import { generateId } from "@repo/ui/lib/generate-id";
import {
  Item,
  ItemActions,
  ItemHeader,
  ItemMedia,
} from "@repo/ui/components/ui/item";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { DataRecord, DataSource } from "grapesjs";

export const DataSourceManager: FC = () => {
  return (
    <WithEditor>
      <DataSourceProvider>
        <DataSourceWrapper />
      </DataSourceProvider>
    </WithEditor>
  );
};

const DataSourceWrapper: FC = () => {
  const editor = useEditorMaybe();
  const { resources, add } = useDataSource();
  const handleAddSource = () => {
    console.log(resources);
    add(generateId(), [
      {
        id: "record-1",
        name: "Record 1",
      },
    ]);
  };
  const handleAddRecord = (source: DataSource) => {
    source.addRecord({
      id: `record-${source.records.length}`,
      name: `Record ${generateId()}`,
    });
    source.trigger("data");
  };
  const handleCopyPath = (record: DataRecord) => {
    const path = record.getPaths();
    const ds = editor?.DataSources;
    console.log(path);
    console.log(record.getPath());
    console.log(ds?.getValue(path[0]!, "DEFAULT VALUE"));
  };
  return (
    <div>
      <h2 className="h-11 border-b text-sm flex items-center px-2">
        Data Source
        <Button variant={"ghost"} size={"icon-sm"} onClick={handleAddSource}>
          <PlusIcon />
        </Button>
      </h2>
      {resources.map((item) => {
        const records = item.getRecords();
        return (
          <Item key={item.id} className="px-2">
            <ItemHeader>
              <ItemMedia>{item.id}</ItemMedia>
              <ItemActions>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  onClick={() => handleAddRecord(item)}
                >
                  <PlusIcon />
                </Button>
              </ItemActions>
            </ItemHeader>
            {records.map((record) => {
              console.log(record, record.get("name"));
              return (
                <div key={`${item.id}-${record.id}`}>
                  <InputGroup>
                    <InputGroupInput defaultValue={record.get("id")} />
                    <InputGroupInput defaultValue={record.get("name")} />
                    <InputGroupButton onClick={() => handleCopyPath(record)}>
                      <ClipboardIcon />
                    </InputGroupButton>
                  </InputGroup>
                  {JSON.stringify(record.toJSON())}
                </div>
              );
            })}
          </Item>
        );
      })}
    </div>
  );
};
