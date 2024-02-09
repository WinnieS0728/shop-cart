import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import { cartItem_schema, cart_schema, shopping_schema } from "@/libs/mongoDB/schemas/cart";
import { cartProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";

import { cookies } from 'next/headers';
import { z } from "zod";

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
                    "items.product": input.product
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
    getCart: cartProcedure
        .input(cart_schema.pick({
            _id: true
        }))
        .output(z.array(cartItem_schema))
        .use(({ next }) => {
            const conn2 = connectToMongo('products')
            return next({
                ctx: {
                    conn2
                }
            })
        })
        .query(async ({ input, ctx }) => {
            const { conn: cartConnection, models: { DB_cart } } = ctx.conn
            const { conn: productConnection, models: { DB_product } } = ctx.conn2

            try {
                const cartList = await DB_cart
                    .findById(input._id)
                    .populate<{
                        items: z.infer<typeof cartItem_schema>[]
                    }>("items.product", 'title price imageUrl', DB_product)
                    .lean().orFail(() => {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: "查無此商品 !"
                        })
                    })

                return cartList.items
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await cartConnection.close()
                await productConnection.close()
            }
        }),
    updateItemQuantity: cartProcedure
        .input(shopping_schema)
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_cart } } = ctx.conn

            try {
                await DB_cart.findByIdAndUpdate(input.product, {
                    $set: {
                        "items.$.quantity": input.quantity
                    }
                })
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
            }
        })
    // removeItemFromCart: cartProcedure.mutation(async () => { }),
})