import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { InputPassword } from "./inputs";

function CardNumber() {
  const { control, register, setFocus, setValue } = useFormContext();
  const [isTyping, setIsTyping] = useState(true);
  const [input1, input2, input3, input4] = useWatch({
    control,
    name: "payment.cardNumber",
  });

  const cardNumberRef = useRef<HTMLDivElement>(null);

  function type(e: KeyboardEvent) {
    if (e.key === "Backspace") {
      setIsTyping(false);
    } else {
      setIsTyping(true);
    }
  }

  const setFocusWhenTyping = useCallback(() => {
    if (input1.length === 4) {
      setFocus("payment.cardNumber.1");
    }
    if (input2.length === 4) {
      setFocus("payment.cardNumber.2");
    }
    if (input3.length === 4) {
      setFocus("payment.cardNumber.3");
    }
  }, [input1.length, input2.length, input3.length, setFocus]);

  const setFocusWhenDeleting = useCallback(() => {
    if (input4.length === 0) {
      setFocus("payment.cardNumber.2");
    }
    if (input3.length === 0) {
      setFocus("payment.cardNumber.1");
    }
    if (input2.length === 0) {
      setFocus("payment.cardNumber.0");
    }
  }, [input2.length, input3.length, input4.length, setFocus]);

  useEffect(() => {
    const cardNumberDiv = cardNumberRef.current;
    if (cardNumberDiv) {
      cardNumberDiv.addEventListener("keydown", type);
      if (isTyping) {
        setFocusWhenTyping();
      } else {
        setFocusWhenDeleting();
      }
    }
    return () => {
      if (cardNumberDiv) {
        cardNumberDiv.removeEventListener("keydown", type);
      }
    };
  }, [isTyping, setFocus, setFocusWhenDeleting, setFocusWhenTyping]);

  return (
    <>
      <div
        ref={cardNumberRef}
        className="flex items-center justify-center gap-2"
      >
        <input
          type="text"
          className="max-w-16 text-center"
          {...register("payment.cardNumber.0")}
          onChange={(event) => {
            const input = (event.target as HTMLInputElement).value;
            const value = input.replace(/[^0-9]/gi, "");
            setValue("payment.cardNumber.0", value);
          }}
          maxLength={4}
          autoComplete="off"
        />
        <span>-</span>
        <input
          type="text"
          className="max-w-16 text-center"
          {...register("payment.cardNumber.1")}
          onChange={(event) => {
            const input = (event.target as HTMLInputElement).value;
            const value = input.replace(/[^0-9]/gi, "");
            setValue("payment.cardNumber.1", value);
          }}
          maxLength={4}
          autoComplete="off"
        />
        <span>-</span>
        <input
          type="text"
          className="max-w-16 text-center"
          {...register("payment.cardNumber.2")}
          onChange={(event) => {
            const input = (event.target as HTMLInputElement).value;
            const value = input.replace(/[^0-9]/gi, "");
            setValue("payment.cardNumber.2", value);
          }}
          maxLength={4}
          autoComplete="off"
        />
        <span>-</span>
        <input
          type="text"
          className="max-w-16 text-center"
          {...register("payment.cardNumber.3")}
          onChange={(event) => {
            const input = (event.target as HTMLInputElement).value;
            const value = input.replace(/[^0-9]/gi, "");
            setValue("payment.cardNumber.3", value);
          }}
          maxLength={4}
          autoComplete="off"
        />
      </div>
    </>
  );
}

function Expiration_date() {
  const { control } = useFormContext();

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

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Controller
          control={control}
          name="payment.expiration_date.0"
          render={({ field: { onChange } }) => (
            <ReactSelect
              instanceId={"payment.expiration_date.0"}
              options={monthOption}
              onChange={(option) => {
                onChange((option as { label: string; value: string }).value);
              }}
            />
          )}
        />
        <span>/</span>
        <Controller
          control={control}
          name="payment.expiration_date.1"
          render={({ field: { onChange } }) => (
            <ReactSelect
              instanceId={"payment.expiration_date.1"}
              options={yearOption}
              onChange={(option) => {
                onChange((option as { label: string; value: string }).value);
              }}
            />
          )}
        />
      </div>
    </>
  );
}

function SecurityCode() {
  return (
    <>
      <InputPassword
        name="payment.security_code"
        maxLength={3}
        className="max-w-16 text-center"
      />
    </>
  );
}

export const creditCard = {
  CardNumber,
  Expiration_date,
  SecurityCode,
};
