"use client";
import { shopping_schema } from "@/libs/mongoDB/schemas/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { Types } from "mongoose";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import FormContainer from "../UI/form";
import { InputOnlyNumber, InputSubmit } from "../UI/inputs";
import { trpc } from "@/providers/trpc provider";
import { Id, toast } from "react-toastify";
import { updateToast } from "@/libs/toast";

interface props {
  productId: string;
}

type submitType = "addToCart" | "justBuy";

export default function ShoppingForm({ productId }: props) {
  const [submitType, setSubmitType] = useState<submitType | undefined>(
    undefined,
  );

  const { mutate: addItemToCart } = trpc.cart.addItemToCart.useMutation();

  const methods = useForm<z.infer<typeof shopping_schema>>({
    resolver: zodResolver(shopping_schema),
    defaultValues: {
      productId: new Types.ObjectId(productId),
      quantity: 0,
    },
  });

  const { handleSubmit, setValue, getValues } = methods;

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof shopping_schema>) {
    // console.log(submitType);

    if (data.quantity === 0) {
      return;
    }

    toastId.current = toast.loading("處理中...");

    addItemToCart(data, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      onSuccess() {
        setValue("quantity", 0);
        updateToast(toastId.current, "success", {
          render: "成功 !",
        });
      },
    });

    if (submitType === "justBuy") {
      // @ redirect
      console.log("redirect to order confirm page");
    }
  }
  return (
    <>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="grid justify-center border-0 p-0"
        >
          <div className="grid w-60 grid-cols-3 place-items-center p-4">
            <button
              type="button"
              className="circle-icon w-8 border"
              onClick={() => {
                if (getValues("quantity") === 0) {
                  return;
                }
                const newNumber = getValues("quantity") - 1;
                setValue("quantity", newNumber);
              }}
            >
              -
            </button>
            <InputOnlyNumber name="quantity" className="border-0 text-center" />
            <button
              type="button"
              className="circle-icon w-8 border"
              onClick={() => {
                const newNumber = getValues("quantity") + 1;
                setValue("quantity", newNumber);
              }}
            >
              +
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputSubmit
              onClick={() => {
                setSubmitType("addToCart");
              }}
              value={"加入購物車"}
            />
            <InputSubmit
              onClick={() => {
                setSubmitType("justBuy");
              }}
              value={"直接購買"}
            />
          </div>
        </FormContainer>
      </FormProvider>
    </>
  );
}
