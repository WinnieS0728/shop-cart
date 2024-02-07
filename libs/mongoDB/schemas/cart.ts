import { Schema, Types } from "mongoose";
import { z } from "zod";
import { product_listSchema } from "./product";

export const shopping_schema = z.object({
    product: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    quantity: z.number().nonnegative()
})

export const cart_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    items: z.array(shopping_schema)
})

export const cartItem_schema = shopping_schema.merge(z.object({
    product: product_listSchema.pick({
        _id: true,
        title: true,
        price: true,
        imageUrl: true
    })
}))

const DB_item_schema = new Schema<z.infer<typeof shopping_schema>>({
    product: {
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