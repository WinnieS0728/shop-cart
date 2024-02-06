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

            try {
                const cart_inc = await DB_cart.findOneAndUpdate({
                    _id: {
                        $eq: cartId_cookie
                    },
                    "items.productId": input.productId
                }, {
                    $inc: {
                        "items.$.quantity": input.quantity
                    }
                }, {
                    returnDocument: 'after'
                })


                if (!cart_inc) {
                    const cart_set = await DB_cart.findOneAndUpdate({
                        _id: {
                            $eq: cartId_cookie
                        },
                    }, {
                        $setOnInsert: {
                            _id: new Types.ObjectId(cartId_cookie),
                        },
                        $push: {
                            items: input
                        }
                    }, {
                        upsert: true,
                        runValidators: true,
                        returnDocument: 'after',
                    })

                    cookieStore.set('cartId', cart_set._id.toString())
                    return 'ok'
                } else {
                    cookieStore.set('cartId', cart_inc._id.toString())
                    return 'ok'
                }
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