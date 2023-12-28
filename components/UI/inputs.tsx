import { product_schema } from "@/libs/mongoDB/models/product";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

interface inputProps {
  name: keyof z.infer<typeof product_schema>;
  placeholder?: string;
}
export function Label({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="flex items-center justify-center gap-2">
      <p className="whitespace-pre">{label}</p>
      {children}
    </label>
  );
}

export function InputText({ name, placeholder }: inputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <input {...field} autoComplete="off" placeholder={placeholder} />
        </>
      )}
    />
  );
}
export function InputOnlyNumber({ name }: inputProps) {
  const { control } = useFormContext();
  return (
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
  );
}
