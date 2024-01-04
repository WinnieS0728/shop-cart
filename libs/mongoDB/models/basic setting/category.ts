import { z } from "zod";

export const categoriesSetting_Schema = z.object({
    categories: z.array(z.object({
        title: z.string().min(1,'請填入類別')
    })),
})