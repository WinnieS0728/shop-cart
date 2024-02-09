import { Schema, Types } from "mongoose";
import { z } from "zod";

export const member_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    title: z.string().min(1, '名稱為必填'),
    threshold: z.number().min(0, '最低門檻為 0')
})

const DB_basicSetting_member_schema = new Schema<z.infer<typeof member_schema>>(
    {
        title: {
            type: String,
            required: true
        },
        threshold: {
            type: Number,
            required: true,
            min: 0
        }
    }, {
    timestamps: true
}
)

export default DB_basicSetting_member_schema