import { Schema, model } from "mongoose";

const userModel = new Schema({
    username: String,
    email: String,
    password: String
}, {
    timestamps: true,
})

const DB_USER = model('users', userModel)

export default DB_USER