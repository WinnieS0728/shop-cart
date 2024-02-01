import { cartProcedure, router } from "@/server/trpc";

export const cartRouter = router({
    addNewCart: cartProcedure.mutation(async () => { })
})