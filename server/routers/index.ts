import { createCaller, createContext, router } from "../trpc";
import { basicSettingRouter } from "./basicSetting";
import { cartRouter } from "./cart";
import { edgestoreRouter } from "./edgestore";
import { productRouter } from "./product";
import { userRouter } from "./user";

export const appRouter = router({
    user: userRouter,
    basicSetting: basicSettingRouter,
    product: productRouter,
    edgestore: edgestoreRouter,
    cart: cartRouter
})

export const serverCaller = createCaller(appRouter)(await createContext())

export type AppRouter = typeof appRouter