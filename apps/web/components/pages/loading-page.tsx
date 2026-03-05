import { Spinner } from "@repo/ui/components/ui/spinner";
import { FC } from "react";

type LoadingPageProps = {
  label?: string;
  description?: string;
};

export const LoadingPage: FC<LoadingPageProps> = ({ label, description }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-12" />
        {label && (
          <div className="text-sm font-semibold text-muted-foreground">
            {label}
          </div>
        )}
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  );
};
