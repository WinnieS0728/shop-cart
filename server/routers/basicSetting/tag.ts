import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const tagRouter = router({
    getTagList: basicSettingProcedure
        .output(z.array(tag_schema))
        .query(async ({ ctx }) => {
            const { conn, models: { DB_tag } } = ctx.conn

            try {
                const categoryList = await DB_tag.find().lean()
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
    updateTag: basicSettingProcedure
        .input(z.array(tag_schema))
        .output(z.array(tag_schema))
        .use(({ next }) => {
            const conn2 = connectToMongo('products')

            return next({
                ctx: {
                    conn2
                }
            })
        })
        .mutation(async ({ input, ctx }) => {
            const { conn: basicSettingConnection, models: { DB_tag } } = ctx.conn
            const { conn: productConnection, models: { DB_product } } = ctx.conn2

            const idList = input.map(tag => tag._id)
            try {
                await Promise.all(input.map(async (tag) => {
                    await DB_tag.findByIdAndUpdate(tag._id, {
                        $set: tag
                    }, {
                        runValidators: true,
                        upsert: true
                    }).lean()
                }))

                await DB_tag.deleteMany({
                    _id: {
                        $nin: idList
                    }
                })

                await DB_product.updateMany({
                    tags: {
                        $elemMatch: {
                            $nin: idList
                        }
                    }
                }, {
                    $pull: {
                        tags: {
                            $nin: idList
                        }
                    }
                }).lean()

                return await DB_tag.find().lean()
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await basicSettingConnection.close()
                await productConnection.close()
            }
        }),
})