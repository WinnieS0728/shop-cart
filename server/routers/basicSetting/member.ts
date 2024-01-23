import { collectionList } from "@/libs/mongoDB/connect mongo";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const memberRouter = router({
    getMemberList: basicSettingProcedure
        .output(z.array(member_schema))
        .query(async ({ ctx }) => {
            const { [`${collectionList.members}`]: DB_member } = ctx.conn.models

            try {
                const memberList = await DB_member.find().sort({
                    threshold: 1
                })
                return memberList
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    createMember: basicSettingProcedure
        .input(member_schema)
        .output(member_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.members}`]: DB_member } = ctx.conn.models
            try {
                const member = await DB_member.create(input)
                return member
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updateMember: basicSettingProcedure
        .input(member_schema)
        .output(member_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.members}`]: DB_member } = ctx.conn.models

            const { _id, title, threshold } = input

            try {
                const updatedDoc = await DB_member.findByIdAndUpdate(_id, {
                    $set: {
                        title,
                        threshold
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
    deleteMember: basicSettingProcedure
        .input(member_schema.pick({
            _id: true
        }))
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.members}`]: DB_member } = ctx.conn.models

            const { _id } = input

            try {
                await DB_member.findByIdAndDelete(_id)
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