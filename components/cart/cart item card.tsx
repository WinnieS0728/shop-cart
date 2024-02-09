"use client";
import { cartItem_schema, shopping_schema } from "@/libs/mongoDB/schemas/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import Counter from "../UI/counter";
import FormContainer from "../UI/form";
import { useEffect } from "react";

interface props {
  itemData: z.infer<typeof cartItem_schema>;
}

export default function CartItemCard({ itemData }: props) {
  const { product, quantity } = itemData;

  const methods = useForm<z.infer<typeof shopping_schema>>({
    resolver: zodResolver(
      shopping_schema.pick({
        quantity: true,
      }),
    ),
    defaultValues: {
      quantity: quantity,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = methods;

  async function onSubmit(data: z.infer<typeof shopping_schema>) {
    console.log("submit data", data);
  }

  const [debounceQuantity, setQuantity] = useDebounceValue(quantity, 1500);
  const w = watch("quantity");

  useEffect(() => {
    if (!isValid || !isDirty) {
      return;
    }
    setQuantity(w);
  }, [isDirty, isValid, setQuantity, w]);

  useEffect(() => {
    if (debounceQuantity === quantity) {
      return;
    }
    onSubmit({
      product: product._id,
      quantity: debounceQuantity,
    });
  }, [debounceQuantity, isDirty, isValid, product._id, quantity]);

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer
          className="border-0 px-4 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <section className="grid grid-cols-[250px_1fr] px-4 py-2">
            <Image
              src={product.imageUrl.thumbnail}
              alt={`${product.title}-image`}
              width={200}
              height={200}
              className=" aspect-square object-contain"
            />
            <article>
              <p>{product.title}</p>
              <p>{product.price}</p>
              <Counter name="quantity" />
            </article>
          </section>
        </FormContainer>
      </FormProvider>
    </>
  );
}
