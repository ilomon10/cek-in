import * as React from "react";
import { useEditor } from "@grapesjs/react";
import type { Component } from "grapesjs";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/ui/item";
import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  Link2Icon,
  SquareIcon,
  TypeIcon,
  VariableIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

export declare interface LayerItemProps
  extends React.HTMLProps<HTMLDivElement> {
  component: Component;
  level: number;
  draggingCmp?: Component;
  dragParent?: Component;
}

const itemStyle = { maxWidth: `100%` };

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
  ...props
}: LayerItemProps) {
  const editor = useEditor();
  const { Layers } = editor;
  const layerRef = useRef<HTMLDivElement>(null);
  const [layerData, setLayerData] = useState(Layers.getLayerData(component));
  const { open, selected, hovered, components, visible, name } = layerData;
  const componentsIds = components.map((cmp) => cmp.getId());
  const isDragging = draggingCmp === component;
  const cmpHash = componentsIds.join("-");
  const level = props.level + 1;
  const isHovered = hovered || dragParent === component;
  const componentType = component.getType() || "default";

  useEffect(() => {
    level === 0 && setLayerData(Layers.getLayerData(component));
    if (layerRef.current) {
      (layerRef.current as any).__cmp = component;
    }
  }, [component]);

  useEffect(() => {
    const up = (cmp: Component) => {
      cmp === component && setLayerData(Layers.getLayerData(cmp));
    };
    const ev = Layers.events.component;
    editor.on(ev, up);

    return () => {
      editor.off(ev, up);
    };
  }, [editor, Layers, component]);

  const cmpToRender = useMemo(() => {
    return components.map((cmp) => (
      <LayerItem
        key={cmp.getId()}
        component={cmp}
        level={level}
        draggingCmp={draggingCmp}
        dragParent={dragParent}
      />
    ));
  }, [cmpHash, draggingCmp, dragParent]);

  const toggleOpen = () => {
    Layers.setLayerData(component, { open: !open });
  };

  const toggleVisibility = (ev: MouseEvent) => {
    Layers.setLayerData(component, { visible: !visible });
  };

  const select = (event: MouseEvent) => {
    Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (value: boolean) => {
    Layers.setLayerData(component, { hovered: value });
  };

  const hasChild = components.length === 0;

  const Icon = () => {
    switch (componentType) {
      case "image":
        return <ImageIcon size={14} />;
      case "link":
        return <Link2Icon size={14} />;
      case "text":
        return <TypeIcon size={14} />;
      case "variable":
        return <VariableIcon size={14} />;
      default:
        return <SquareIcon size={14} />;
    }
  };

  return (
    <Collapsible open={open}>
      <Item
        data-active={selected}
        data-visible={visible}
        data-dragging={isDragging}
        data-hover={isHovered}
        className={
          "p-0 w-full flex gap-2 text-red cursor-pointer data-[active=true]:bg-accent opacity-50 data-[visible=true]:opacity-100 data-[hover=true]:bg-primary-foreground data-[hover=true]:border-accent-foreground hover:border-accent-foreground rounded-none"
        }
      >
        <ItemMedia
          className="pl-2"
          onClick={() => !visible || (!hasChild && toggleOpen())}
          style={{ marginLeft: `${level * 10}px` }}
        >
          <ChevronDownIcon
            size={14}
            className={cn(
              "transition-all -rotate-90",
              open && "rotate-0",
              hasChild && "opacity-0"
            )}
          />
          <Icon />
        </ItemMedia>
        <ItemContent
          onClick={select}
          onMouseEnter={() => hover(true)}
          onMouseLeave={() => hover(false)}
          className={cn("max-w-full border-b", level === 0 && "border-t")}
          data-layer-item
          ref={layerRef}
        >
          <div className={"flex p-1 pr-2 gap-1 items-center"}>
            <ItemTitle className="truncate flex-grow" style={itemStyle}>
              {name}
            </ItemTitle>
            <div
              data-hover={selected || hovered}
              className={cn(
                "data-[hover=true]:opacity-100 cursor-pointer",
                visible ? "opacity-0" : "opacity-100"
              )}
              onClick={toggleVisibility}
            >
              {visible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
            </div>
          </div>
        </ItemContent>
      </Item>
      <CollapsibleContent>
        {!!(open && components.length) && (
          <div className={cn("max-w-full", !open && "hidden")}>
            {cmpToRender}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
