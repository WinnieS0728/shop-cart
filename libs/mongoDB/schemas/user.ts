import { Schema, Types } from "mongoose";
import { z } from "zod";

export const user_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
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
        cardNumber: z.string(),
        expiration_date: z.array(z.string()),
        security_code: z.string()
    }).superRefine((value, ctx) => {
        const allInputs = {
            cardNumber: {
                value: value.cardNumber,
                validation: () => value.cardNumber.replace(/ /g, '').trim().length === 16,
                message: '請填寫完整卡號',
                path: ['cardNumber']
            },
            month: {
                value: value.expiration_date[0],
                validation: () => value.expiration_date[0],
                message: '請填寫完整到期日',
                path: ['expiration_date', 0]
            },
            year: {
                value: value.expiration_date[1],
                validation: () => value.expiration_date[1],
                message: '請填寫完整到期日',
                path: ['expiration_date', 1]
            },
            security_code: {
                value: value.security_code,
                validation: () => value.security_code.trim().length === 3,
                message: '請填寫完整安全碼',
                path: ['security_code']
            }
        }
        const allValues = Object.values(allInputs).map(data => data.value)

        if (allValues.every(v => !v)) {
            return
        }

        Object.values(allInputs).map(data => {
            if (!data.validation()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: data.message,
                    path: data.path
                })
            }
        })

    }),
    consumption: z.number().min(0, '最低消費金額是 0'),
    role: z.enum(['admin', 'user']).default('user')
})

export const signIn_schema = user_schema.pick({
    email: true,
    password: true
})

export const signUp_schema = user_schema.pick({
    username: true,
    email: true,
    password: true,
    avatar: true,
})

const DB_user_schema = new Schema<z.infer<typeof user_schema>>({
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
                    return !value || value.replace(/ /g, "").trim().length === 16
                },
                message: '請完整填寫卡號'
            }
        },
        expiration_date: {
            type: [String],
            default: ["", ""],
            validate: {
                validator: function (value: [string, string]) {
                    const [month, year] = value
                    return (!month && !year) || (month && year)
                },
                message: '請完整填寫到期日'
            }
        },
        security_code: {
            type: String,
            default: "",
            validate: {
                validator: function (value: string) {
                    return !value || value.trim().length === 3
                },
                message: '請完整填寫安全碼'
            }
        }
    },
    consumption: {
        type: Number,
        required: true,
        default: 0,
        min: [0, '最低累計消費金額是 0']
    },
    role: {
        type: String,
        default: 'user'
    }
}, {
    timestamps: true,
})

export default DB_user_schema