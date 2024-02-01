import { shopping_schema } from "@/libs/mongoDB/schemas/cart";
import { cartProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";

import { cookies } from 'next/headers';

export const cartRouter = router({
    addItemToCart: cartProcedure
        .input(shopping_schema)
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_cart } } = ctx.conn
            const cookieStore = cookies()
            const cartId_cookie = cookieStore.get('cartId')?.value

            console.log('what is adding to cart', input);

            try {
                const cart = await DB_cart.findByIdAndUpdate(cartId_cookie, {
                    $addToSet: {
                        items: {
                            productId: input.productId,
                            quantity: input.quantity
                        }
                    }
                }, {
                    runValidators: true,
                    upsert: true,
                    returnDocument: 'after'
                })
                cookieStore.set('cartId', cart._id.toString())

                return 'ok'
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
            }
        }),
    // removeItemFromCart: cartProcedure.mutation(async () => { }),
    // getCart: cartProcedure.query(async () => { })
})