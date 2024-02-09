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
import Counter from "../UI/counter";

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
      product: new Types.ObjectId(productId),
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
      // TODO redirect
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
          <Counter name="quantity" />
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
