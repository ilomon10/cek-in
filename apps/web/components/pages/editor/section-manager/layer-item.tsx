import * as React from "react";
import { useEditor } from "@grapesjs/react";
import type { Component } from "grapesjs";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/ui/item";
import {
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  Link2Icon,
  SquareIcon,
  TypeIcon,
  VariableIcon,
} from "lucide-react";

export declare interface LayerItemProps
  extends React.HTMLProps<HTMLDivElement> {
  component: Component;
  draggingCmp?: Component;
  dragParent?: Component;
}

const itemStyle = { maxWidth: `100%` };

export function LayerList(props: LayerItemProps) {
  const editor = useEditor();
  const { Layers } = editor;
  const [layerData, setLayerData] = useState(
    Layers.getLayerData(props.component)
  );
  const { components } = layerData;

  const componentsIds = components.map((cmp) => cmp.getId());
  const cmpHash = componentsIds.join("-");

  useEffect(() => {
    const up = (cmp: Component) => {
      cmp === props.component && setLayerData(Layers.getLayerData(cmp));
    };
    const ev = Layers.events.component;
    editor.on(ev, up);

    return () => {
      editor.off(ev, up);
    };
  }, [editor, Layers, props.component]);

  const cmpToRender = useMemo(() => {
    return components.map((cmp) => (
      <LayerItem
        key={cmp.getId()}
        component={cmp}
        draggingCmp={props.draggingCmp}
        dragParent={props.dragParent}
      />
    ));
  }, [cmpHash, props.draggingCmp, props.dragParent]);

  return cmpToRender;
}

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
}: LayerItemProps) {
  const editor = useEditor();
  const { Layers } = editor;
  const layerRef = useRef<HTMLDivElement>(null);
  const [layerData, setLayerData] = useState(Layers.getLayerData(component));
  const { selected, hovered, visible } = layerData;
  const name = component.getTrait("name")?.getValue() || layerData.name;
  const isDragging = draggingCmp === component;
  const isHovered = hovered || dragParent === component;
  const componentType = component.getType() || "default";

  useEffect(() => {
    setLayerData(Layers.getLayerData(component));
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

  const toggleVisibility = (ev: MouseEvent) => {
    Layers.setLayerData(component, { visible: !visible });
  };

  const select = (event: MouseEvent) => {
    Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (value: boolean) => {
    Layers.setLayerData(component, { hovered: value });
  };

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
    <Item
      ref={layerRef}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
      data-layer-item
      onClick={select}
      data-active={selected}
      data-visible={visible}
      data-dragging={isDragging}
      data-hover={isHovered}
      className={
        "w-full gap-2 text-red cursor-pointer data-[active=true]:bg-accent opacity-50 data-[visible=true]:opacity-100 data-[hover=true]:bg-primary-foreground data-[hover=true]:border-accent-foreground hover:border-accent-foreground rounded-none"
      }
    >
      <ItemMedia onClick={toggleVisibility}>
        {visible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="truncate flex-grow" style={itemStyle}>
          {name}
        </ItemTitle>
        {/* <div
          data-hover={selected || hovered}
          className={cn(
            "data-[hover=true]:opacity-100 cursor-pointer",
            visible ? "opacity-0" : "opacity-100"
          )}
          onClick={toggleVisibility}
        >
          {visible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
        </div> */}
      </ItemContent>
    </Item>
  );
}
