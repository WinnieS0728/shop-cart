import { user_schema } from "@/libs/mongoDB/schemas/user";
import { router, userProcedure } from "../trpc";
import { collectionList } from "@/libs/mongoDB/connect mongo";

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
        })
})