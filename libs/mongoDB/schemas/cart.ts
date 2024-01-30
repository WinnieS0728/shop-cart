import { Schema, Types } from "mongoose";
import { z } from "zod";

export const shopping_schema = z.object({
    productId: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    quantity: z.number().positive()
})

export const cart_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    order_from: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    items: z.array(shopping_schema)
})



const DB_cart_schema = new Schema<z.infer<typeof cart_schema>>({
    order_from: Schema.Types.ObjectId,
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            validate: {
                validator: (value: number) => value >= 0,
                message: '購物數量不可小於 0'
            }
        }
    }],
}, {
    timestamps: true,
})

export default DB_cart_schema