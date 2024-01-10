import { useMemo, ReactNode } from "react";
import {
  useFormContext,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController,
} from "react-hook-form";

import { InputPassword, InputText } from "./inputs";
import { ReactSelect } from "./select";
import { cn } from "@/libs/utils/cn";

function CardNumber() {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
  } = useController({
    control,
    name: "payment.cardNumber",
  });
  return (
    <>
      <InputText
        name="payment.cardNumber"
        maxLength={19}
        value={value
          ?.replace(/[^0-9]/gi, "")
          .replace(/(\d{4})/g, "$1 ")
          .trim() || ""}
        onChange={(event) => {
          const input = event.target.value;
          const value = input
            .replace(/[^0-9]/gi, "")
            .replace(/(\d{4})/g, "$1 ")
            .trim();
          onChange(value);
        }}
      />
    </>
  );
}

function Expiration_date() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  function get2NumberMonth(month: number): string {
    if (month < 10) {
      return `0${month}`;
    } else {
      return String(month);
    }
  }

  function getLast2NumberOfTheYear(year: number) {
    const lastWord = String(year).at(-1);
    const last2Word = String(year).at(-2);

    return `${last2Word}${lastWord}`;
  }

  const monthOption = useMemo(() => {
    return new Array(12).fill(0).map((_, index) => ({
      label: get2NumberMonth(index + 1),
      value: get2NumberMonth(index + 1),
    }));
  }, []);

  const yearOption = useMemo(() => {
    return new Array(12).fill(2020).map((number, index) => ({
      label: getLast2NumberOfTheYear(number + index),
      value: getLast2NumberOfTheYear(number + index),
    }));
  }, []);

  const expiration_date_error = (
    errors.payment as
      | Merge<
          FieldError,
          FieldErrorsImpl<{
            cardNumber: string[];
            expiration_date: string[];
            security_code: string;
          }>
        >
      | undefined
  )?.expiration_date;

  return (
    <>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="payment.expiration_date.0"
          render={({
            field: { onChange },
            fieldState: { error },
            formState: { defaultValues },
          }) => (
            <div className="flex flex-col">
              <ReactSelect
                instanceId={"payment.expiration_date.0"}
                name="expiration_date-month"
                className="w-24"
                options={monthOption}
                defaultValue={
                  defaultValues?.payment?.expiration_date[0]
                    ? {
                        label: defaultValues.payment.expiration_date[0],
                        value: defaultValues.payment.expiration_date[0],
                      }
                    : undefined
                }
                onChange={(option) => {
                  onChange((option as { label: string; value: string }).value);
                }}
                placeholder="MM"
              />
              {error && (
                <p className="text-sm text-red-500">*{error.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="payment.expiration_date.1"
          render={({
            field: { onChange },
            fieldState: { error },
            formState: { defaultValues },
          }) => (
            <div className="flex flex-col">
              <ReactSelect
                instanceId={"payment.expiration_date.1"}
                name="expiration_date-year"
                className="w-24"
                options={yearOption}
                defaultValue={
                  defaultValues?.payment?.expiration_date[1]
                    ? {
                        label: defaultValues.payment.expiration_date[1],
                        value: defaultValues.payment.expiration_date[1],
                      }
                    : undefined
                }
                onChange={(option) => {
                  onChange((option as { label: string; value: string }).value);
                }}
                placeholder="YY"
              />
              {error && (
                <p className="text-sm text-red-500">*{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
      {expiration_date_error && (
        <p className="text-sm text-red-500">
          *{expiration_date_error.root?.message}
        </p>
      )}
    </>
  );
}

function SecurityCode() {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="payment.security_code"
        defaultValue={""}
        render={({ field: { onChange } }) => (
          <InputPassword
            name="payment.security_code"
            maxLength={3}
            className="max-w-16 text-center"
            placeholder="***"
            onChange={(event) => {
              const input = (event.target as HTMLInputElement).value;
              const value = input.replace(/[^0-9]/gi, "");
              onChange(value);
            }}
          />
        )}
      />
    </>
  );
}

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aspect-video w-[30rem] rounded-xl border bg-slate-200 px-10 py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
export function CreditCard() {
  return (
    <>
      <div className="relative aspect-video w-[40rem]">
        <Card className="absolute left-0 top-0 z-10 flex flex-col justify-between drop-shadow-xl">
          <div className="self-end">logo</div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 uppercase">card number</p>
              <CardNumber />
            </div>
            <div>
              <p className="mb-1 uppercase">exp. date</p>
              <Expiration_date />
            </div>
          </div>
        </Card>
        <Card className="absolute bottom-0 right-0 flex items-center justify-end">
          <div className="absolute left-0 top-12 h-16 w-full bg-black/50"></div>
          <div className="mt-12">
            <p className="mb-1 uppercase">cvc</p>
            <SecurityCode />
          </div>
        </Card>
      </div>
    </>
  );
}
