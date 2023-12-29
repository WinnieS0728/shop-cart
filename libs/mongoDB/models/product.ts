import { Schema, model } from "mongoose";
import { z } from "zod";

export const product_schema = z.object({
    title: z.string().min(1,'請填入商品名字'),
    content: z.string(),
    category: z.array(z.string()),
    price: z.number().min(0,'請填入商品價格').max(9999,'別賣這麼貴'),
    stock: z.number().min(0,'請填入庫存數量'),
    sold: z.number(),
    imageUrl: z.string(),
    tags: z.array(z.string())
})

const productModel = new Schema<z.infer<typeof product_schema>>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    category: {
        type: [String]
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
        type: Number
    },
    imageUrl: {
        type: String
    },
    tags: {
        type: [String]
    }
}, {
    timestamps: true,
})

const DB_PRODUCT = model('products', productModel)

export default DB_PRODUCT