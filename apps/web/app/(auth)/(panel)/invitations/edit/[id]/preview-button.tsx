import { Button } from "@repo/ui/components/ui/button";
import { ScanEyeIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const PreviewButton: FC<{ redirectTo: string }> = ({ redirectTo }) => {
  return (
    <Button asChild variant={"outline"}>
      <Link href={redirectTo} target="_blank">
        <ScanEyeIcon />
        Preview
      </Link>
    </Button>
  );
};
