import * as React from "react";
import { AssetsResultProps, useEditor } from "@grapesjs/react";
import type {
  Asset,
  AssetAddInput,
  AssetProps as GJSAssetProps,
  Editor,
} from "grapesjs";
import { Button } from "@repo/ui/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { FileButton } from "@repo/ui/components/ui/seragam/file-button";
import { fileToBase64 } from "@/components/utils/file-to-base64";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

export type AssetManagerProps = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
> & {
  onUpload?: (files: File[]) => Promise<AssetType[] | undefined>;
  onLoaded?: (props: any, editor: Editor) => void;
  onRemove?: (id: string | number) => Promise<void>;
};

export type AssetType = GJSAssetProps & {
  assetId: number;
  alt: string;
  thumbnail?: string;
  category: "project-assets" | "user-assets";
};

export default function AssetManager({
  assets,
  select,
  onUpload,
  onLoaded,
  onRemove,
}: AssetManagerProps) {
  const editor = useEditor();

  const handleUpload = async (files: File[]) => {
    let res: AssetAddInput[] = [];
    if (onUpload) {
      const result = await onUpload(files);
      console.log("after", result, files);
      if (result) {
        res = result;
      }
    } else {
      for (let file of files) {
        res.push(await fileToBase64(file));
      }
    }
    editor.Assets.add(res);
  };

  const remove = (asset: Asset) => {
    if (onUpload && onRemove) {
      if (asset.attributes.assetId) onRemove(asset.attributes.assetId);
    }
    editor.Assets.remove(asset);
  };

  const handleSelect = (asset: Asset) => {
    asset.set("category", "project-assets");
    select(asset, true);
  };

  React.useEffect(() => {
    const up = (props: any) => {
      if (!onLoaded) return;
      onLoaded?.(props, editor);
    };
    editor.on("asset:custom", up);
    return () => {
      editor.off("asset:custom", up);
    };
  }, [editor]);

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Input placeholder="Search file" />
        </div>
        <div>
          <FileButton onChange={handleUpload}>Upload File</FileButton>
        </div>
      </div>
      <ScrollArea className="grow h-[1px]">
        <div className="grid grid-cols-4 gap-2 pr-2">
          {assets.map((asset) => (
            <div
              key={asset.getSrc()}
              className="relative rounded border overflow-hidden"
            >
              <AspectRatio className="w-full">
                <img
                  className="display-block object-contain size-full"
                  src={asset.get("thumbnail") || asset.getSrc()}
                />
              </AspectRatio>
              <Button
                type="button"
                size={"icon-sm"}
                variant={"destructive"}
                className="absolute top-2 right-2"
                onClick={() => remove(asset)}
              >
                <Trash2Icon size={1} />
              </Button>
              <div className="flex items-center justify-end px-2 py-1 border-t">
                <div className="text-sm truncate">{asset.getFilename()}</div>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => handleSelect(asset)}
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
