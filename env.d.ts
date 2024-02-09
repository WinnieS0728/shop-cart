declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URL: string
        NEXTAUTH_GOOGLE_ID: string
        NEXTAUTH_GOOGLE_SECRET: string
        NEXTAUTH_SECRET: string
    }
}