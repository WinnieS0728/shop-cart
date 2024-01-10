import { Schema } from "mongoose";
import { z } from "zod";

export const user_schema = z.object({
    username: z.string().min(1, "請填入姓名"),
    email: z.string().email('請填入正確 email 格式'),
    password: z.string().min(1, "請填入密碼"),
    avatar: z.object({
        normal: z.string(),
        thumbnail: z.string()
    }),
    phone: z.string(),
    address: z.string(),
    payment: z.object({
        cardNumber: z.string().refine((value) => {
            if (value.replace(/ /g, "").length !== 16) {
                return false
            }else {
                return true
            }
            
        }, {
            message: '請填寫完整卡號',
        }),
        expiration_date: z.array(z.string()).refine((value) => {
            const [month, year] = value
            return (!month && !year) || (month && year)
        }, {
            message: '請填寫完整到期日',
        }),
        security_code: z.string().refine((value) => (value.length === 0 || value.length === 3), {
            message: "安全碼錯誤"
        })
    }),
    consumption: z.number().min(0, '最低消費金額是 0')
})

export const signUp_schema = user_schema.pick({
    username: true,
    email: true,
    password: true,
    avatar: true
})

const DB_user = new Schema<z.infer<typeof user_schema>>({
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
        default: ''
    },
    avatar: {
        normal: {
            type: String,
            default: ""
        },
        thumbnail: {
            type: String,
            default: ""
        }
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    payment: {
        cardNumber: {
            type: String,
            default: "",
            validate: {
                validator: function (value: string) {
                    if (value.replace(/ /g, "").length !== 16) {
                        return true
                    }
                },
                message: '請完整填寫卡號'
            }
        },
        expiration_date: {
            type: [String],
            default: ["", ""]
        },
        security_code: {
            type: String,
            default: ""
        }
    },
    consumption: {
        type: Number,
        required: true,
        default: 0,
        min: [0, '最低累計消費金額是 0']
    }
}, {
    timestamps: true,
})

export default DB_user