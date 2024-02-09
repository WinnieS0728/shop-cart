declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URL: string
        NEXTAUTH_GOOGLE_ID: string
        NEXTAUTH_GOOGLE_SECRET: string
        NEXTAUTH_SECRET: string
        EDGE_STORE_ACCESS_KEY: string
        EDGE_STORE_SECRET_KEY: string
    }
}