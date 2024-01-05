import { connectToMongo } from "@/libs/mongoDB/connect mongo"
import DB_USER, { user_schema } from "@/libs/mongoDB/models/user"
import NextAuth, { NextAuthOptions } from "next-auth"
import bcrypt from 'bcrypt'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { z } from "zod"
import { models } from "mongoose"

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
                    try {
                        await connectToMongo('users')
                        const user = await DB_USER.findOne({
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
                            image: user.avatar
                        }
                    } catch (error) {
                        throw error
                    }
                }
                return null
            },
        }),
        GoogleProvider({
            clientId: process.env.NEXTAUTH_GOOGLE_ID,
            clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET
        }),
    ]
} satisfies NextAuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }