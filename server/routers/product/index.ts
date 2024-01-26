import { product_listSchema } from "@/app/api/mongoDB/products/methods";
import { edgestoreServer, imageServerAction } from "@/libs/edgestore/server";
import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { productProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
    createProduct: productProcedure
        .input(product_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { confirmImage } = imageServerAction('productImage')

            try {
                await DB_product.create(input)

                await confirmImage(input.imageUrl.normal)

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
            const { imageProcess } = imageServerAction('productImage')

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

                await imageProcess(origin_product.imageUrl.normal, input.imageUrl.normal)

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
            const { deleteImage } = imageServerAction('productImage')

            try {
                const origin_product = await DB_product.findByIdAndDelete(input._id).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此商品 !'
                    })
                })

                await deleteImage(origin_product.imageUrl.normal)

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