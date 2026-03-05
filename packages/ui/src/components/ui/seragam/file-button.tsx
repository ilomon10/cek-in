import { FC, useCallback } from "react";
import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import { useDropzone } from "react-dropzone";

type FileButtonProps = Omit<ButtonProps, "type" | "onChange"> & {
  onChange: (files: File[]) => void;
};

export const FileButton: FC<FileButtonProps> = ({
  id = "srg-file-button",
  children,
  onChange,
  ...props
}) => {
  const onDrop = useCallback((files: File[]) => {
    onChange(files);
  }, []);

  const { getInputProps } = useDropzone({ onDrop });
  return (
    <>
      <Button {...props}>
        <label htmlFor={id}>{children}</label>
      </Button>
      <input id={id} {...getInputProps()} />
    </>
  );
};
