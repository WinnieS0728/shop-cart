import { collectionList } from "@/libs/mongoDB/connect mongo";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const tagRouter = router({
    getTagList: basicSettingProcedure
        .output(z.array(tag_schema))
        .query(async ({ ctx }) => {
            const { [`${collectionList.tags}`]: DB_tag } = ctx.conn.models

            try {
                const categoryList = await DB_tag.find()
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
    createTag: basicSettingProcedure
        .input(tag_schema)
        .output(tag_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.tags}`]: DB_tag } = ctx.conn.models
            try {
                const category = await DB_tag.create(input)
                return category
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updateTag: basicSettingProcedure
        .input(tag_schema)
        .output(tag_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.tags}`]: DB_tag } = ctx.conn.models

            const { _id, title } = input

            try {
                const updatedDoc = await DB_tag.findByIdAndUpdate(_id, {
                    $set: {
                        title,
                    }
                }, {
                    runValidators: true,
                    returnDocument: 'after'
                })
                return updatedDoc
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    deleteTag: basicSettingProcedure
        .input(tag_schema.pick({
            _id: true
        }))
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.tags}`]: DB_tag } = ctx.conn.models

            const { _id } = input

            try {
                await DB_tag.findByIdAndDelete(_id)
                return 'ok'
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        })
})