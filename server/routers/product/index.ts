import { product_listSchema } from "@/app/api/mongoDB/products/methods";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { productProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productRouter = router({
    getProductList: productProcedure
        .output(z.array(product_listSchema))
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
                            code: 'BAD_REQUEST',
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
        .output(z.any())
        .mutation(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { conn: basicSettingConnection, models: { DB_category, DB_tag } } = ctx.conn2
            try {
                const product = await DB_product.create(input)

                console.log(product);

                return product
            } catch (error) {

            } finally {
                await productConnection.close()
                await basicSettingConnection.close()
            }
        }),
    updateProduct: productProcedure
        .input(product_schema)
        .output(product_listSchema)
        .mutation(async ({ input, ctx }) => {
            const { conn: productConnection, models: { DB_product } } = ctx.conn
            const { conn: basicSettingConnection, models: { DB_category, DB_tag } } = ctx.conn2

            try {
                const updatedProduct = await DB_product.findByIdAndUpdate(input._id, {
                    $set: input
                }, {
                    runValidators: true,
                    returnDocument: 'after',
                })
                    .populate<Pick<z.infer<typeof product_listSchema>, 'categories'>>('categories', 'title', DB_category)
                    .populate<Pick<z.infer<typeof product_listSchema>, 'tags'>>('tags', 'title', DB_tag)
                    .lean().orFail(() => {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: '查無此商品 !'
                        })
                    })

                return updatedProduct
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
        })
})