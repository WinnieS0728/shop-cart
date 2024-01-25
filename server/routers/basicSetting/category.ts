import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = router({
    getCategoryList: basicSettingProcedure
        .output(z.array(category_schema))
        .query(async ({ ctx }) => {
            const { conn, models: { DB_category } } = ctx.conn

            try {
                const categoryList = await DB_category.find()
                return categoryList
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
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
            const { conn: basicSettingConnection, models: { DB_category } } = ctx.conn
            const { conn: productConnection, models: { DB_product } } = ctx.conn2
            const idList = input.map(category => category._id)

            try {
                await Promise.all(input.map(async (category) => {
                    await DB_category.findByIdAndUpdate(category._id, {
                        $set: category
                    }, {
                        runValidators: true,
                        upsert: true,
                    })
                }))

                await DB_category.deleteMany({
                    _id: {
                        $nin: idList
                    }
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

                return await DB_category.find().lean()
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await basicSettingConnection.close()
                await productConnection.close()
            }
        })
})