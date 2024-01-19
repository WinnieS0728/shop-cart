import { appRouter } from '@/server/routers'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'


export async function createContext(req: NextRequest) {
    return { req }
}

const handler = (req: NextRequest) => fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
})

export { handler as GET, handler as POST }