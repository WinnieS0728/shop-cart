import { collectionList, connectToMongo } from "@/libs/mongoDB/connect mongo";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = router({
    getCategoryList: basicSettingProcedure
        .output(z.array(category_schema))
        .query(async ({ ctx }) => {
            const { [`${collectionList.categories}`]: DB_category } = ctx.conn.models

            try {
                const categoryList = await DB_category.find()
                return categoryList
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updateCategory: basicSettingProcedure
        .input(z.array(category_schema))
        .output(z.array(category_schema))
        .use(({ next }) => {
            const conn2 = connectToMongo('products')

            return next({
                ctx: {
                    conn2
                }
            })
        })
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.categories}`]: DB_category } = ctx.conn.models
            const { [`${collectionList.products}`]: DB_product } = ctx.conn2.models
            const idList = input.map(data => data._id)

            try {
                await Promise.all(input.map(async (data) => {
                    return await DB_category.findByIdAndUpdate(data._id, {
                        $set: data
                    }, {
                        runValidators: true,
                        returnDocument: 'after',
                        upsert: true,
                    })
                }))

                await DB_category.deleteMany({
                    _id: {
                        $nin: idList
                    }
                }, {
                    returnDocument: 'after'
                })

                await DB_product.updateMany({
                    categories: {
                        $elemMatch: {
                            $nin: idList
                        }
                    }
                }, {
                    $pull: {
                        categories: {
                            $nin: idList
                        }
                    }
                })

                return await DB_category.find()
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
                await ctx.conn2.close()
            }
        })
})