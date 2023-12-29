import React, { InputHTMLAttributes, ReactNode, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { eye } from "@icons";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
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
        <div className="w-full ps-4">{children}</div>
      </label>
    </>
  );
}

export function InputText({ name, placeholder, error, ...props }: inputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <input
            {...field}
            {...props}
            autoComplete="off"
            placeholder={placeholder}
          />
          {error && <p className="text-sm text-red-500">*{error}</p>}
        </>
      )}
    />
  );
}
export function InputOnlyNumber({ name, error, ...props }: inputProps) {
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
              {...props}
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

export function InputPassword({ name, ...props }: inputProps) {
  const { control } = useFormContext();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center justify-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              {...field}
              autoComplete="off"
              {...props}
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (
                <eye.open className="text-xl" />
              ) : (
                <eye.close className="text-xl" />
              )}
            </button>
          </div>
        )}
      />
    </>
  );
}
