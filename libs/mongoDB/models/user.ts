import { Schema, model } from "mongoose";
import { z } from "zod";

export const user_schema = z.object({
    username: z.string().min(1, "請填入姓名"),
    email: z.string().email('請填入正確 email 格式'),
    password: z.string().min(1, "請填入密碼"),
    phone: z.string(),
    address: z.string(),
    payment: z.object({
        cardNumber: z.array(z.string().length(4, '卡號錯誤')),
        expiration_date: z.array(z.string().length(2, '到期日錯誤')),
        security_code: z.string().length(3, '安全碼錯誤')
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