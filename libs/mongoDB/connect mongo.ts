import mongoose from "mongoose";
import DB_user from "./schemas/user";
import DB_basicSetting_category from "./schemas/basic setting/category";
import DB_basicSetting_member from "./schemas/basic setting/member";
import DB_basicSetting_tag from "./schemas/basic setting/tag";
import DB_product from "./schemas/product";

type myDataBase = "users" | 'products' | 'basic-setting'

export const modelList = {
    categories: 'categories',
    members: 'members',
    tags: 'tags',
    users: 'users',
    products: 'products'
} as const

export function connectToMongo(dbName: myDataBase) {
    const conn = mongoose.createConnection(`${process.env.MONGO_URL}/${dbName}`)
    conn.on('connected', () => console.log(`connect to ${dbName} success !`))
    conn.on('close', (error) => console.log(`close ${dbName} success !`, error))
    conn.on('disconnected', () => console.log(`disconnect to ${dbName} !`))
    conn.on('error', (error) => console.log(`connect to ${dbName} fail !`, error))

    switch (dbName) {
        case 'basic-setting':
            conn.model(modelList.categories, DB_basicSetting_category)
            conn.model(modelList.members, DB_basicSetting_member)
            conn.model(modelList.tags, DB_basicSetting_tag)
            break;
        case 'users':
            conn.model(modelList.users, DB_user)
            break;
        case 'products':
            conn.model(modelList.products, DB_product)
            break;
        default:
            console.log('no model should be connect !');
            break;
    }

    return conn
}