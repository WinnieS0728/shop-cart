import { collectionList } from "@/libs/mongoDB/connect mongo";
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
                const categoryList = await DB_category.find().sort({
                    threshold: 1
                })
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
    createCategory: basicSettingProcedure
        .input(category_schema)
        .output(category_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.categories}`]: DB_category } = ctx.conn.models
            try {
                const category = await DB_category.create(input)
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
    updateCategory: basicSettingProcedure
        .input(category_schema)
        .output(category_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.categories}`]: DB_category } = ctx.conn.models

            const { _id, title } = input

            try {
                const updatedDoc = await DB_category.findByIdAndUpdate(_id, {
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
    deleteCategory: basicSettingProcedure
        .input(category_schema.pick({
            _id: true
        }))
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.categories}`]: DB_category } = ctx.conn.models

            const { _id } = input

            try {
                await DB_category.findByIdAndDelete(_id)
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