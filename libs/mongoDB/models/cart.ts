import { Schema, SchemaTypes, model } from "mongoose";

const cartModel = new Schema({
    products: [SchemaTypes.ObjectId],
    order_from: SchemaTypes.ObjectId,
}, {
    timestamps: true,
})

const DB_CART = model('carts', cartModel)

export default DB_CART