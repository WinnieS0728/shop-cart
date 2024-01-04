import React, { InputHTMLAttributes, ReactNode, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { eye } from "@icons";
import { cn } from "@/libs/utils/cn";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
export function Label({
  children,
  label,
  required,
  htmlFor,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <>
      <div className="flex w-full flex-col items-start justify-center">
        <label className="relative my-1 whitespace-pre" htmlFor={htmlFor}>
          {required && (
            <span className="absolute -left-2 -top-1 text-red-500">*</span>
          )}
          {label}
        </label>
        <div className="w-full ps-4">{children}</div>
      </div>
    </>
  );
}

export function InputText({
  name,
  placeholder,
  className,
  ...props
}: inputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name!}
      render={({ field, fieldState: { error } }) => (
        <>
          <input
            {...field}
            {...props}
            autoComplete="off"
            placeholder={placeholder}
            className={cn("", className, {
              "border-2 border-red-500 focus-visible:outline-red-500": error,
            })}
          />
          {error && <p className="text-sm text-red-500">*{error.message}</p>}
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
        name={name!}
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

export function InputPassword({ name, error, ...props }: inputProps) {
  const { control } = useFormContext();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <Controller
        control={control}
        name={name!}
        render={({ field }) => (
          <div className="flex items-center justify-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              {...field}
              {...props}
              autoComplete="off"
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
      {error && <p className="text-sm text-red-500">*{error}</p>}
    </>
  );
}

export function InputSubmit({ value }: inputProps) {
  return (
    <>
      <input
        type="submit"
        value={value}
        className="cursor-pointer rounded-md bg-yellow-500"
      />
    </>
  );
}
