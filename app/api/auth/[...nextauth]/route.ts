import NextAuth from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

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

                    return {
                        id: '1',
                        email,
                        password
                    }
                }
                return null
            },
        }),
        GoogleProvider({
            clientId: process.env.NEXTAUTH_GOOGLE_ID,
            clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET
        })
        // ...add more providers here
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }