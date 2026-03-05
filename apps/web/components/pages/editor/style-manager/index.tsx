import * as React from "react";
import { StylesResultProps } from "@grapesjs/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import StylePropertyField from "./style-property-field";
import { Property } from "grapesjs";

export default function StyleManager({
  sectors,
}: Omit<StylesResultProps, "Container">) {
  const hasValue = (properties: Property[]) => {
    return properties.reduce<boolean>((prev, prop) => {
      if (prop.hasValue()) {
        return true;
      }
      return prev;
    }, false);
  };
  return (
    <div className="gjs-custom-style-manager text-left">
      <Accordion type="multiple">
        {sectors.map((sector) => {
          const properties = sector.getProperties();
          const isHasValue = hasValue(properties);
          return (
            <AccordionItem key={sector.getId()} value={sector.getId()}>
              <AccordionTrigger className="px-2 py-2">
                <div className="flex items-center gap-2">
                  {sector.getName()}
                  {isHasValue && (
                    <div className="size-2 rounded-full bg-primary" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-wrap">
                {properties.map((prop) => {
                  return <StylePropertyField key={prop.getId()} prop={prop} />;
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
