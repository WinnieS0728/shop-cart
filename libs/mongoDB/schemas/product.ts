import { Schema, model } from "mongoose";
import { z } from "zod";

export const product_schema = z.object({
    title: z.string().min(1, '請填入商品名字'),
    content: z.string(),
    category: z.array(z.string()),
    price: z.number().min(0, '請填入商品價格').max(9999, '別賣這麼貴'),
    stock: z.number().min(0, '請填入庫存數量'),
    sold: z.number(),
    imageUrl: z.object({
        normal: z.string(),
        thumbnail: z.string()
    }),
    tags: z.array(z.string())
})

const DB_product_schema = new Schema<z.infer<typeof product_schema>>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    category: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    imageUrl: {
        normal: {
            type: String,
            default: ""
        },
        thumbnail: {
            type: String,
            default: ""
        }
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
})

export default DB_product_schema