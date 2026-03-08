import { CheckIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@repo/ui/components/ui/item";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { dataProvider } from "@/components/providers/data-provider";
import { Tenant, TenantUser, User } from "@/components/providers/payload-types";
import { useRouter } from "next/navigation";
import { useUser } from "../auth-route";

type TenantInitializerProps = {
  className?: string;
  isActive: boolean;
  values: {
    name: string;
    email: string;
    phone: string;
    file: File;
  };
  onSubmit?: () => void;
};

type StepFn = (prev?: any) => Promise<any>;

export const TenantOnboardingStep3: FC<TenantInitializerProps> = ({
  className,
  isActive,
  values,
  onSubmit: onFinish,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const STEPS: {
    label: string;
    fn?: StepFn;
  }[] = [
    {
      label: "Submitting your information",
      fn: async () => {
        const res = await dataProvider().custom?.({
          url: "/tenants/create",
          method: "post",
          payload: {
            name: values.name,
            email: values.email,
            phone: values.phone,
          },
        });

        return res?.data?.doc as Tenant;
      },
    },
    {
      label: "Configuring your application",
      fn: async (tenant: Tenant) => {
        const media = await dataProvider().create({
          resource: "media",
          variables: {
            _file: values.file,
            alt: `${tenant.name} logo`,
          },
        });

        const updatedTenant = await dataProvider().update({
          resource: "tenants",
          id: tenant.id,
          variables: {
            logoAsset: media.data.id,
          },
        });

        return updatedTenant.data;
      },
    },
    {
      label: "Starting your workspace",
      fn: async (tenant: Tenant) => {
        const res = await dataProvider().getOne({
          resource: "users",
          id: user?.id as number,
        });
        const index = (res.data.tenantUsers?.docs as TenantUser[]).findIndex(
          ({ tenant: t }) => tenant.id === t,
        );

        return index;
      },
    },
    {
      label: "Redirecting to application",
      fn: async (index: number) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.replace(`/orgs/${index}/dashboard`);
      },
    },
  ];

  useEffect(() => {
    if (!isActive) return;

    const runInitializer = async () => {
      let prevResult: any = undefined;

      for (let i = 0; i < STEPS.length; i++) {
        const stepItem = STEPS[i];
        setStep(i);

        if (stepItem?.fn) {
          prevResult = await stepItem.fn(prevResult);
        }
      }

      setStep(STEPS.length);

      onFinish?.();
    };

    runInitializer();
  }, [isActive, onFinish]);

  return (
    <div className={cn("grow flex flex-col justify-center gap-6", className)}>
      <h1 className="text-2xl font-semibold px-4">Preparing your business</h1>

      <p className="text-muted-foreground px-4">
        Do not close this window until complete
      </p>

      <ItemGroup>
        {STEPS.map(({ label }, index) => {
          const isDone = step > index;
          const isCurrent = step === index;

          return (
            <Item
              key={label}
              variant={isDone ? "default" : isCurrent ? "outline" : "muted"}
            >
              <ItemMedia>
                {isDone ? <CheckIcon /> : isCurrent ? <Spinner /> : null}
              </ItemMedia>

              <ItemContent>{label}</ItemContent>

              <ItemActions>
                {isDone ? "Done" : isCurrent ? "Processing..." : ""}
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
    </div>
  );
};
