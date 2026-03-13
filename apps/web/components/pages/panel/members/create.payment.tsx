import { useFormContext } from "react-hook-form";
import { FormInput } from "../form-input";

export const MemberCreatePayment = () => {
  const form = useFormContext();

  const isPaid = form.watch("payment.paid");

  return (
    <>
      <FormInput
        control={form.control}
        type="checkbox"
        name="payment.paid"
        label="Is Paid"
      />

      {isPaid && (
        <FormInput
          control={form.control}
          type="selector"
          name="payment.method"
          label="Payment method"
          listClassName="grid-cols-4 gap-2"
          options={[
            { label: "Cash", value: "cash" },
            { label: "Trasfer", value: "transfer" },
            { label: "QRIS", value: "qris" },
            { label: "Other", value: "other" },
          ]}
        />
      )}
    </>
  );
};
