import { Schema, model } from "mongoose";

const cartModel = new Schema({
    products: [Schema.Types.ObjectId],
    order_from: Schema.Types.ObjectId,
}, {
    timestamps: true,
})

const DB_CART = model('carts', cartModel)

export default DB_CART