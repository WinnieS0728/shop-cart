import { product_schema } from "@/libs/mongoDB/models/product";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

interface inputProps {
  name: keyof z.infer<typeof product_schema>;
  placeholder?: string;
  error?: string;
}
export function Label({
  children,
  label,
  required,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <>
      <label className="flex flex-col items-start justify-center">
        <p className="relative my-1 whitespace-pre">
          {required && (
            <span className="absolute -left-2 -top-1 text-red-500">*</span>
          )}
          {label}
        </p>
        <div className="ps-4 w-full">{children}</div>
      </label>
    </>
  );
}

export function InputText({ name, placeholder, error }: inputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <input {...field} autoComplete="off" placeholder={placeholder} />
          {error && <p className="text-sm text-red-500">*{error}</p>}
        </>
      )}
    />
  );
}
export function InputOnlyNumber({ name, error }: inputProps) {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <input
              {...field}
              onClick={(event) => {
                (event.target as HTMLInputElement).value = "";
              }}
              onChange={(event) => {
                const input = (event.target as HTMLInputElement).value;
                const value = input.replace(/[^0-9]/gi, "");
                field.onChange(Number(value));
              }}
              onBlur={(event) => {
                const input = event.target.value;
                if (input === "") {
                  event.target.value = "0";
                  field.onChange(0);
                }
              }}
              autoComplete="off"
            />
          </>
        )}
      />
      {error && <p className="text-sm text-red-500">*{error}</p>}
    </>
  );
}
