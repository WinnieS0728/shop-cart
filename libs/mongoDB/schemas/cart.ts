import { Schema, Types } from "mongoose";
import { z } from "zod";

export const shopping_schema = z.object({
    productId: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    quantity: z.number().nonnegative()
})

export const cart_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    items: z.array(shopping_schema)
})

const DB_item_schema = new Schema<z.infer<typeof shopping_schema>>({
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
}, {
    _id: false,
    timestamps: true
})

const DB_cart_schema = new Schema<z.infer<typeof cart_schema>>({
    items: {
        type: [DB_item_schema],
        default: [],
    },
}, {
    timestamps: true,
})

export default DB_cart_schema