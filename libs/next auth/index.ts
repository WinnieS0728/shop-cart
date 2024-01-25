import { connectToMongo } from "@/libs/mongoDB/connect mongo"
import { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    type: 'email'
                },
                password: {
                    type: 'password'
                }
            },
            async authorize(credentials) {
                if (credentials) {
                    const { email, password } = credentials
                    const { conn, models: { DB_user } } = connectToMongo('users')

                    try {
                        const user = await DB_user.findOne({
                            email: { $eq: email }
                        })
                        if (!user) {
                            throw new Error('查無此用戶 !')
                        }
                        const pass = await bcrypt.compare(password, user?.password)
                        if (!pass) {
                            throw new Error('密碼錯誤 !')
                        }
                        return {
                            id: user._id.toString(),
                            name: user.username,
                            email: user.email,
                            image: user.avatar.thumbnail,
                            role: user.role
                        }
                    } catch (error) {
                        throw error
                    } finally {
                        await conn.close()
                    }
                }
                return null
            },
        }),
        GoogleProvider({
            clientId: process.env.NEXTAUTH_GOOGLE_ID,
            clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const { conn, models: { DB_user } } = connectToMongo('users')
            try {
                const isUserExist = !!(await DB_user.exists({
                    email: {
                        $eq: user.email
                    }
                }))
                if (!isUserExist) {
                    await DB_user.create({
                        username: user.name,
                        email: user.email,
                        avatar: user.image,
                    })
                }
                return true
            } catch (error) {
                console.log(error);
                return false
            } finally {
                await conn.close()
            }
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.id = account.id
                token.accessToken = account.access_token
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                token
            }
        },
    },
    pages: {
        signIn: '/admin/signIn'
    }

} satisfies NextAuthOptions

declare module 'next-auth' {
    interface Session {
        token: JWT
    }
    interface User {
        role: "admin" | "user"
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: "admin" | "user"
    }
}