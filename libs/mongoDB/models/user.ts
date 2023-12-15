import { Schema } from "mongoose";

const userModel = new Schema({
    username: String,
    email: String,
    password: String
})