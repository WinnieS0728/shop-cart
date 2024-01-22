import { user_schema } from "@/libs/mongoDB/schemas/user";
import { router, userProcedure } from "../trpc";
import { collectionList } from "@/libs/mongoDB/connect mongo";
import { TRPCError } from "@trpc/server";
import { password_schema } from "@/app/admin/user/updatePassword/page";

export const userRouter = router({
    getUserByEmail: userProcedure
        .input(user_schema.pick({
            email: true
        }))
        .output(user_schema)
        .query(async ({ input, ctx }) => {
            const { email } = input
            const { [`${collectionList.users}`]: DB_user } = ctx.conn.models
            try {
                const user = await DB_user.findOne({ email: { $eq: email } })
                if (!user) {
                    throw '該用戶不存在 !'
                }
                return user
            } catch (error) {
                return error
            } finally {
                await ctx.conn.close()
            }
        }),
    updateUser: userProcedure
        .input(user_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.users}`]: DB_user } = ctx.conn.models

            try {
                const updateDoc = await DB_user.findByIdAndUpdate(input._id, {
                    $set: input
                }, {
                    runValidators: true,
                    returnDocument: 'after'
                })
                return updateDoc
            } catch (error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updatePassword: userProcedure
        // .input(password_schema)
        .mutation(async ({ input, ctx }) => {
            console.log(input);
            try {
                return '1'
            } catch (error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        })
})