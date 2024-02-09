"use client";
import { Controller, useFormContext } from "react-hook-form";
import { InputOnlyNumber } from "./inputs";

interface props {
  name: string;
}

export default function Counter({ name }: props) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="grid w-60 grid-cols-3 place-items-center p-4">
          <button
            type="button"
            className="circle-icon w-8 border"
            onClick={() => {
              if (value === 0) {
                return;
              }
              const newNumber = value - 1;
              onChange(newNumber);
            }}
          >
            -
          </button>
          <InputOnlyNumber name={name} className="border-0 text-center" />
          <button
            type="button"
            className="circle-icon w-8 border"
            onClick={() => {
              const newNumber = value + 1;
              onChange(newNumber);
            }}
          >
            +
          </button>
        </div>
      )}
    ></Controller>
  );
}
