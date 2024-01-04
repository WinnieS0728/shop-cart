import { Schema, model, models } from "mongoose";
import { z } from "zod";

export const memberSetting_Schema = z.object({
    member: z.array(z.object({
        title: z.string().min(1, '名稱為必填'),
        threshold: z.number().min(0, '最低門檻為 0')
    }))
})

const memberSettingModel = new Schema<z.infer<typeof memberSetting_Schema>['member'][number]>(
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

const DB_basicSetting_member = models?.members || model('members', memberSettingModel)

export default DB_basicSetting_member