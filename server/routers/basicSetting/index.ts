import { router } from "@/server/trpc";
import { memberRouter } from "./member";
import { categoryRouter } from "./category";

export const basicSettingRouter = router({
    member: memberRouter,
    category: categoryRouter,
})