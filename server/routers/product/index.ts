import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import { product_listSchema, product_schema } from "@/libs/mongoDB/schemas/product";
import { productProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { serverCaller } from "..";

export const productRouter = router({
    getProductList: productProcedure
        .output(z.array(product_listSchema))
        .use(({ next }) => {
            const conn2 = connectToMongo('basicSetting')

            return next({
                ctx: {
                    conn2
                }
            })
        })
        .query(async ({ ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { conn: basicSettingConnection, models: {
                DB_category,
                DB_tag
            } } = ctx.conn2

            try {
                const productList = await DB_product
                    .find()
                    .populate<Pick<z.infer<typeof product_listSchema>, 'categories'>>('categories', 'title', DB_category)
                    .populate<Pick<z.infer<typeof product_listSchema>, 'tags'>>('tags', 'title', DB_tag)
                    .lean()

                return productList
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await productConnection.close()
                await basicSettingConnection.close()
            }
        }),
    getProductById: productProcedure
        .input(product_schema.pick({
            _id: true
        }))
        .output(product_listSchema)
        .use(({ next }) => {
            const conn2 = connectToMongo('basicSetting')

            return next({
                ctx: {
                    conn2
                }
            })
        })
        .query(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { conn: basicSettingConnection, models: {
                DB_category,
                DB_tag
            } } = ctx.conn2

            try {
                const product = await DB_product
                    .findOne({ _id: input._id })
                    .populate<Pick<z.infer<typeof product_listSchema>, 'categories'>>('categories', 'title', DB_category)
                    .populate<Pick<z.infer<typeof product_listSchema>, 'tags'>>('tags', 'title', DB_tag)
                    .lean()
                    .orFail(() => {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: '查無此商品 !'
                        })
                    })

                return product
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await productConnection.close()
                await basicSettingConnection.close()
            }
        }),
    getTop3: productProcedure
        .output(z.array(product_listSchema))
        .use(({ next }) => {
            const conn2 = connectToMongo('basicSetting')
            return next({
                ctx: {
                    conn2
                }
            })
        })
        .query(async ({ ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { conn: settingConnection, models: { DB_category, DB_tag } } = ctx.conn2
            try {
                const top3 = await DB_product.find()
                    .sort({
                        sold: 'desc'
                    })
                    .limit(3)
                    .populate<Pick<z.infer<typeof product_listSchema>, 'categories'>>('categories', 'title', DB_category)
                    .populate<Pick<z.infer<typeof product_listSchema>, 'tags'>>('tags', 'title', DB_tag)
                    .lean()

                return top3

            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await productConnection.close()
                await settingConnection.close()
            }
        }),
    createProduct: productProcedure
        .input(product_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn

            try {
                await DB_product.create(input)

                await serverCaller.edgestore.confirmImage({
                    folder: 'productImage',
                    url: input.imageUrl.normal
                })

                return 'ok'
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await productConnection.close()
            }
        }),
    updateProduct: productProcedure
        .input(product_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn

            try {
                const origin_product = await DB_product.findByIdAndUpdate(input._id, {
                    $set: input
                }, {
                    runValidators: true,
                })
                    .lean().orFail(() => {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: '查無此商品 !'
                        })
                    })

                await serverCaller.edgestore.imageProcess({
                    folder: 'productImage',
                    url: {
                        before: origin_product.imageUrl.normal,
                        after: input.imageUrl.normal
                    }
                })

                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await productConnection.close()
            }
        }),
    deleteProduct: productProcedure
        .input(product_schema.pick({
            _id: true
        }))
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_product } } = ctx.conn

            try {
                const origin_product = await DB_product.findByIdAndDelete(input._id).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此商品 !'
                    })
                })

                await serverCaller.edgestore.deleteImage({
                    folder: 'productImage',
                    url: origin_product.imageUrl.normal
                })

                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
            }
        })
})