import { Date, Types } from "mongoose"

export type ModelType<T> = T & {
    _id: Types.ObjectId,
    createAt: Date,
    updateAt: Date,
    __v: number
}