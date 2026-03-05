import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import { Button } from "@repo/ui/components/ui/button";
import { ReactElement } from "react";
import { redirect } from "next/navigation";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home(): ReactElement {
  redirect("/welcome");
}
