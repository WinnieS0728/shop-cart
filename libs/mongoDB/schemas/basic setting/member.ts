import { Schema, model, models } from "mongoose";
import { z } from "zod";
import { findRepeat } from "@/libs/utils/find repeat";

export const memberSetting_Schema = z.object({
    member: z.array(z.object({
        title: z.string().min(1, '名稱為必填'),
        threshold: z.number().min(0, '最低門檻為 0')
    }))
        .superRefine((value, ctx) => {
            const isTitleRepeat = value.length !== new Set(value.map(data => data.title)).size

            if (isTitleRepeat) {
                findRepeat(value.map(data => data.title)).map((index) => {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: '名稱重複',
                        path: [index!, 'title']
                    })
                })
            }

            const isThresholdRepeat = value.length !== new Set(value.map(data => data.threshold)).size
            if (isThresholdRepeat) {
                findRepeat(value.map(data => data.threshold)).map((index) => {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: '門檻重複',
                        path: [index!, 'threshold']
                    })
                })
            }

            
        })
})

const DB_basicSetting_member = new Schema<z.infer<typeof memberSetting_Schema>['member'][number]>(
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

export default DB_basicSetting_member