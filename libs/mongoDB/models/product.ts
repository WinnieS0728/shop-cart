import { Schema, model } from "mongoose";
import { z } from "zod";

export const product_schema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.array(z.string()),
    price: z.number(),
    stock: z.number(),
    imageUrl: z.string(),
    tags: z.array(z.string())
})

const productModel = new Schema<z.infer<typeof product_schema>>({
    title: {
        type: String
    },
    content: {
        type: String
    },
    category: {
        type: [String]
    },
    price: {
        type: Number
    },
    stock: {
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