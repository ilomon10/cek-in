import * as React from "react";

export type Option = {
  key: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export interface IconProps extends React.ComponentProps<"svg"> {
  name: string;
  options: Option[];
}

export function Icon({ name, options, ...props }: IconProps) {
  const Comp = options.find(({ key }) => key === name)?.icon;
  if (!Comp) return null;
  return <Comp {...props} />;
}

// Example usage
// const buttons = [{ key: "undo", icon: UndoIcon }, { key: "redo", icon: RedoIcon }];
// const ActionButtons = () => (
//
//   <>
//     {buttons.map(({ icon }) => (
//       <Icon key={icon} name={icon} className="w-5 h-5" />
//     ))}
//   </>
// );
