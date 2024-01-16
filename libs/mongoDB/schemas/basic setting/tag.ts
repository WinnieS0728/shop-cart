import { Schema, Types } from "mongoose";
import { z } from "zod";

export const tag_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    title: z.string()
})

const DB_basicSetting_tag_schema = new Schema<z.infer<typeof tag_schema>>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


export default DB_basicSetting_tag_schema