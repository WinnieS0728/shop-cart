import { serverCaller } from "@/server/routers";
import Image from "next/image";
import ShoppingForm from "./shopping form";
import ProductDetail from "./product detail";
import { JSON_serialize } from "@/libs/utils/serialize";

interface props {
  productId: string;
}

export default async function Product({ productId }: props) {
  const product = await serverCaller.product.getProductById({
    _id: productId,
  });

  return (
    <>
      <section className="grid gap-4">
        <section className="grid gap-2 sm:grid-cols-[auto_1fr]">
          <Image
            src={product.imageUrl.normal}
            alt={`product-${product.title} image`}
            width={300}
            height={300}
            className="w-full"
            priority
          />
          <article className="grid gap-4 p-4">
            <h2 className="text-4xl">{product.title}</h2>
            <div className="flex flex-col items-start justify-center gap-2">
              <p>建議售價</p>
              <p className="ms-4 text-xl">
                $NTD {product.price.toLocaleString()}
              </p>
            </div>
            <ShoppingForm productId={productId} />
          </article>
        </section>
        <section>
          <ProductDetail initData={JSON_serialize(product)} />
        </section>
      </section>
    </>
  );
}
