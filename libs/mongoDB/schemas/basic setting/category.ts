import { Schema, Types } from "mongoose";
import { z } from "zod";

export const category_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    title: z.string().min(1, '請填入類別')
})

const DB_basicSetting_category_schema = new Schema<z.infer<typeof category_schema>>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default DB_basicSetting_category_schema