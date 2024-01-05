import { findRepeat } from "@/libs/utils/find repeat";
import { Schema, model, models } from "mongoose";
import { z } from "zod";

export const tagSetting_Schema = z.object({
    tags: z.array(z.object({
        title: z.string()
    })).superRefine((value, ctx) => {
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
    }),
})

const tagSettingModel = new Schema<z.infer<typeof tagSetting_Schema>['tags'][number]>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const DB_basicSetting_tag = models?.tags || model('tags', tagSettingModel)

export default DB_basicSetting_tag