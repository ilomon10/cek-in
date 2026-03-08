import { Button } from "@repo/ui/components/ui/button";
import { ArrowUpRightIcon, ScanEyeIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const GoToButton: FC<{ redirectTo: string }> = ({ redirectTo }) => {
  return (
    <Button asChild>
      <Link href={redirectTo} target="_blank">
        <ArrowUpRightIcon />
        Open the Invitation
      </Link>
    </Button>
  );
};
