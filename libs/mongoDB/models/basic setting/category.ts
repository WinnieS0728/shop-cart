import { findRepeat } from "@/libs/utils/find repeat";
import { Schema, model, models } from "mongoose";
import { z } from "zod";

export const categoriesSetting_Schema = z.object({
    categories: z.array(z.object({
        title: z.string().min(1, '請填入類別')
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

const categorySettingModel = new Schema<z.infer<typeof categoriesSetting_Schema>['categories'][number]>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const DB_basicSetting_category = models?.categories || model('categories', categorySettingModel)

export default DB_basicSetting_category