import { Schema, model } from "mongoose";
import { z } from "zod";

export const tagSetting_Schema = z.object({
    tags: z.array(z.object({
        title: z.string()
    }))
})