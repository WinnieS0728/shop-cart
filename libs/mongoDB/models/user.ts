import { Schema, model } from "mongoose";
import { z } from "zod";

export const user_schema = z.object({
    username: z.string().min(1, "請填入姓名"),
    email: z.string().email('請填入正確 email 格式'),
    password: z.string().min(1, "請填入密碼"),
    avatar: z.string().url(),
    phone: z.string(),
    address: z.string(),
    payment: z.object({
        cardNumber: z.array(z.string().refine((value) => (value.length === 0 || value.length === 4), {
            message: '請填寫完整卡號',
        })).length(4, '卡號錯誤'),
        expiration_date: z.array(z.string()).refine((value) => {
            const [month, year] = value
            return (!month && !year) || (month && year)
        }, {
            message: '請填寫完整到期日',
        }),
        security_code: z.string().refine((value) => (value.length === 0 || value.length === 3), {
            message: "安全碼錯誤"
        })
    })
})

export const signUp_schema = user_schema.pick({
    username: true,
    email: true,
    password: true,
    avatar: true
})

const userModel = new Schema<z.infer<typeof user_schema>>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    payment: {
        cardNumber: [String],
        expiration_date: [String],
        security_code: String
    },
}, {
    timestamps: true,
})

const DB_USER = model('users', userModel)

export default DB_USER