import { collectionList } from "@/libs/mongoDB/connect mongo";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { user_schema } from "@/libs/mongoDB/schemas/user";
import { basicSettingProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const memberRouter = router({
    getMemberList: basicSettingProcedure
        .output(z.array(member_schema))
        .query(async ({ ctx }) => {
            const { conn, models: { DB_member } } = ctx.conn

            try {
                const memberList = await DB_member.find().sort({
                    threshold: 1
                }).lean(0)
                return memberList
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
            }
        }),
    getLevel: basicSettingProcedure
        .input(user_schema.pick({
            consumption: true
        }))
        .output(z.object({
            nowLevel: member_schema,
            nextLevel: z.nullable(member_schema)
        }))
        .query(async ({ input, ctx }) => {
            const { conn, models: { DB_member } } = ctx.conn
            const { consumption } = input
            try {
                const nowLevel = await DB_member.findOne({
                    threshold: {
                        $lte: consumption
                    }
                }).sort({
                    threshold: -1
                }).limit(1).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無目前階級 !'
                    })
                })

                const nextLevel = await DB_member.findOne({
                    threshold: {
                        $gt: consumption
                    }
                }).sort({ threshold: 1 }).limit(1).lean()

                return {
                    nowLevel,
                    nextLevel
                }
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
        }),
    updateMember: basicSettingProcedure
        .input(z.array(member_schema))
        .output(z.array(member_schema))
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_member } } = ctx.conn

            const idList = input.map(member => member._id)

            try {
                await Promise.all(input.map(async (member) => {
                    await DB_member.findByIdAndUpdate(member._id, {
                        $set: member
                    }, {
                        runValidators: true,
                        upsert: true
                    }).lean()
                }))

                await DB_member.deleteMany({
                    _id: {
                        $nin: idList
                    }
                })

                return await DB_member.find().lean()
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await conn.close()
            }
        }),
})