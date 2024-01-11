import mongoose from "mongoose";
import { DB_schemaList } from "./schemas";

export const dbList = { users : "users", products: "products", basicSetting: "basic-setting"} as const

export const collectionList = {
    categories: 'categories',
    members: 'members',
    tags: 'tags',
    users: 'users',
    products: 'products'
} as const

export function connectToMongo(dbName: typeof dbList[keyof typeof dbList]) {
    const conn = mongoose.createConnection(`${process.env.MONGO_URL}`, {
        dbName
    })
    conn.once('connected', () => console.log(`connect to ${dbName} success !`))
    conn.once('close', () => console.log(`${dbName} closed !`))
    conn.on('error', (error) => console.log(`connect to ${dbName} fail !`, error))

    switch (dbName) {
        case 'basic-setting':
            conn.model(collectionList.categories, DB_schemaList.basicSetting.categories)
            conn.model(collectionList.members, DB_schemaList.basicSetting.members)
            conn.model(collectionList.tags, DB_schemaList.basicSetting.tags)
            break;
        case 'users':
            conn.model(collectionList.users, DB_schemaList.users)
            break;
        case 'products':
            conn.model(collectionList.products, DB_schemaList.products)
            break;
        default:
            console.log('no model should be connect !');
            break;
    }

    return conn
}