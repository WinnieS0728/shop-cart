import { createCaller, createContext, router } from "../trpc";
import { basicSettingRouter } from "./basicSetting";
import { userRouter } from "./user";

export const appRouter = router({
    user: userRouter,
    basicSetting: basicSettingRouter
})

export const serverCaller = createCaller(appRouter)(await createContext())

export type AppRouter = typeof appRouter