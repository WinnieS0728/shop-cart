import { connectToMongo, dbList, collectionList } from "@/libs/mongoDB/connect mongo"
import NextAuth, { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { createConnection } from "mongoose"

export const authOptions = {
    // Configure one or more authentication providers
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
                    const conn = connectToMongo('users')
                    const { models: {
                        [`${collectionList.users}`]: DB_user
                    } } = conn
                    try {
                        const user = await DB_user.findOne({
                            email: { $eq: email }
                        })
                        const pass = await bcrypt.compare(password, user?.password)
                        if (!pass) {
                            throw new Error('密碼錯誤 !')
                        }
                        return {
                            id: user._id,
                            name: user.username,
                            email: user.email,
                            image: user.avatar,
                            isMember: true
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
            try {
                const { models: { [`${collectionList.users}`]: DB_user } } = connectToMongo('users')
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
            }
        },
    },
    // pages: {
    //     signIn: '/admin'
    // }

} satisfies NextAuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }