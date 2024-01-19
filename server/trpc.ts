import { createContext } from '@/app/api/trpc/[trpc]/route'
import { connectToMongo } from '@/libs/mongoDB/connect mongo'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<typeof createContext>().create({
    transformer: superjson
})


export const router = t.router
export const userProcedure = t.procedure.use(({ next }) => {
    const conn = connectToMongo('users')
    return next({
        ctx: {
            conn
        }
    })
})


export const basicSettingProcedure = t.procedure
export const productProcedure = t.procedure