import { password_schema, signUp_schema, user_schema } from "@/libs/mongoDB/schemas/user";
import { router, userProcedure } from "../trpc";
import { collectionList } from "@/libs/mongoDB/connect mongo";
import { TRPCError } from "@trpc/server";
import bcrypt from 'bcryptjs'

export const userRouter = router({
    createUser: userProcedure
        .input(signUp_schema)
        .output(user_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.users}`]: DB_user } = ctx.conn.models

            const { username, email, password, avatar } = input

            try {
                const isUserExist = await DB_user.exists({ email: { $eq: email } })
                if (isUserExist) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '此 email 已註冊 !'
                    })
                }
                const hashedPassword = await bcrypt.hash(password, 10)
                const updatedDoc = await DB_user.create({
                    username,
                    email,
                    password: hashedPassword,
                    avatar
                })
                return updatedDoc
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            } finally {
                await ctx.conn.close()
            }
        }),
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
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '該用戶不存在 !'
                    })
                }
                return user
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error,
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updateUser: userProcedure
        .input(user_schema)
        .output(user_schema)
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
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error,
                })
            } finally {
                await ctx.conn.close()
            }
        }),
    updatePassword: userProcedure
        .input(password_schema)
        .output(user_schema)
        .mutation(async ({ input, ctx }) => {
            const { [`${collectionList.users}`]: DB_user } = ctx.conn.models
            const { _id, origin_password, new_password } = input
            try {
                const userData = await DB_user.findById(_id).select('password')
                if (!userData) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無使用者'
                    })
                }
                const passwordPass = await bcrypt.compare(origin_password, userData.password)
                if (!passwordPass) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: '密碼輸入錯誤'
                    })
                }
                const newPassword = await bcrypt.hash(new_password, 10)
                const updatedDoc = await DB_user.findByIdAndUpdate(_id, {
                    $set: {
                        password: newPassword
                    }
                }, {
                    runValidators: true,
                    returnDocument: 'after'
                })
                return updatedDoc
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error,
                })
            } finally {
                await ctx.conn.close()
            }
        })
})