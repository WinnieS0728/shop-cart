import { Schema, model } from "mongoose";
import { z } from "zod";

export const user_schema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string(),
    address: z.string(),
    payment: z.object({
        cardNumber: z.array(z.string()),
        expiration_date: z.array(z.string()),
        security_code: z.string()
    })
})

const userModel = new Schema<z.infer<typeof user_schema>>({
    username: String,
    email: String,
    password: String,
    phone: Number,
    address: String,
    payment: {
        cardNumber: [String],
        expiration_date: [String],
        security_code: Number
    },
}, {
    timestamps: true,
})

const DB_USER = model('users', userModel)

export default DB_USER