import { password_schema, signUp_schema, user_schema } from "@/libs/mongoDB/schemas/user";
import { router, userProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from 'bcryptjs'
import { z } from "zod";
import { imageServerAction } from "@/libs/edgestore/server";

export const userRouter = router({
    createUser: userProcedure
        .input(signUp_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_user } } = ctx.conn

            const { username, email, password, avatar } = input
            const { confirmImage } = imageServerAction('userAvatar')

            try {
                const isUserExist = await DB_user.exists({ email: { $eq: email } })
                if (isUserExist) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '此 email 已註冊 !'
                    })
                }
                const hashedPassword = await bcrypt.hash(password, 10)
                await DB_user.create({
                    username,
                    email,
                    password: hashedPassword,
                    avatar
                })

                await confirmImage(avatar.normal)

                return 'ok'
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
    getUserByEmail: userProcedure
        .input(user_schema.pick({
            email: true
        }))
        .output(user_schema)
        .query(async ({ input, ctx }) => {
            const { email } = input
            const { conn, models: { DB_user } } = ctx.conn
            try {
                const user = await DB_user.findOne({ email: { $eq: email } }).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此用戶 !'
                    })
                })

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
                await conn.close()
            }
        }),
    updateUser: userProcedure
        .input(user_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_user } } = ctx.conn
            const { imageProcess } = imageServerAction('userAvatar')

            try {
                const origin_user = await DB_user.findByIdAndUpdate(input._id, {
                    $set: input
                }, {
                    runValidators: true,
                }).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: "查無此用戶 !"
                    })
                })

                await imageProcess(origin_user.avatar.normal, input.avatar.normal)

                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error,
                })
            } finally {
                await conn.close()
            }
        }),
    updatePassword: userProcedure
        .input(password_schema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { conn, models: { DB_user } } = ctx.conn
            const { _id, origin_password, new_password } = input
            try {
                const userData = await DB_user.findById(_id).select('password').lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此用戶 !'
                    })
                })
                const passwordPass = await bcrypt.compare(origin_password, userData.password)
                if (!passwordPass) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: '舊密碼輸入錯誤'
                    })
                }
                const newPassword = await bcrypt.hash(new_password, 10)
                await DB_user.findByIdAndUpdate(_id, {
                    $set: {
                        password: newPassword
                    }
                }, {
                    runValidators: true,
                }).lean().orFail(() => {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此用戶 !'
                    })
                })

                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error,
                })
            } finally {
                await conn.close()
            }
        })
})