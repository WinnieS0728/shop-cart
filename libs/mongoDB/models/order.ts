import { Schema, SchemaTypes, model } from "mongoose";

const orderModel = new Schema({
    order_from: SchemaTypes.ObjectId,
    products: [SchemaTypes.ObjectId],
    is_paid: Boolean,
    is_shipped: Boolean
}, {
    timestamps: true,
})

const DB_ORDER = model('orders', orderModel)

export default DB_ORDER