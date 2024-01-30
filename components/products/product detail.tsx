"use client";
import { shopping_schema } from "@/libs/mongoDB/schemas/cart";
import { product_listSchema } from "@/libs/mongoDB/schemas/product";
import { trpc } from "@/providers/trpc provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import FormContainer from "../UI/form";
import { InputOnlyNumber, InputSubmit } from "../UI/inputs";

interface props {
  initData: z.infer<typeof product_listSchema>;
}

export default function ProductDetail({ initData }: props) {
  const { data: product } = trpc.product.getProductById.useQuery(
    {
      _id: initData._id,
    },
    {
      initialData: initData,
    },
  );
  const methods = useForm<z.infer<typeof shopping_schema>>({
    resolver: zodResolver(shopping_schema),
    defaultValues: {
      productId: product._id,
      quantity: 0,
    },
  });

  const { handleSubmit, setValue, getValues } = methods;

  async function onSubmit(data: z.infer<typeof shopping_schema>) {
    console.log(data);
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <section className="flex">
            <article>image</article>
            <article className="w-full">
              <h2>{product.title}</h2>
              <p>{product.price.toLocaleString()}</p>
              <div className="grid w-60 grid-cols-3 place-items-center bg-red-500">
                <button
                  type="button"
                  className="circle-icon w-8 border"
                  onClick={() => {
                    const newNumber = getValues("quantity") - 1;
                    setValue("quantity", newNumber);
                  }}
                >
                  -
                </button>
                <InputOnlyNumber name="quantity" />
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
              <div>
                <InputSubmit />
              </div>
            </article>
          </section>
        </FormContainer>
      </FormProvider>
    </>
  );
}
