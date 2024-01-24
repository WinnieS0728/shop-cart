import { router } from "@/server/trpc";
import { memberRouter } from "./member";
import { categoryRouter } from "./category";
import { tagRouter } from "./tag";

export const basicSettingRouter = router({
    member: memberRouter,
    category: categoryRouter,
    tag: tagRouter
})