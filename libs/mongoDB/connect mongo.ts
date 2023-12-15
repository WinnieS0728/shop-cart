import mongoose from "mongoose";

type myDataBase = "users" | 'products'

export async function connectToMongo(dbName: myDataBase) {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${dbName}`)
        console.log('connect to mongoDB');
    } catch (error) {
        console.log('connect error', error);
    }
}