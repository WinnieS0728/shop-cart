import { z } from "zod";

export const basicSetting_Schema = z.object({
    categories: z.array(z.object({
        title: z.string()
    })),
    member: z.array(z.object({
        title: z.string(),
        threshold: z.number()
        
    }))
})