import mongoose, { Connection, Model } from "mongoose";
import { z } from "zod";
import { DB_schemaList } from "./schemas";
import { category_schema } from "./schemas/basic setting/category";
import { member_schema } from "./schemas/basic setting/member";
import { tag_schema } from "./schemas/basic setting/tag";
import { cart_schema } from "./schemas/cart";
import { product_schema } from "./schemas/product";

export const dbList = { users: "users", products: "products", basicSetting: "basicSetting" } as const

export const collectionList = {
    categories: 'categories',
    members: 'members',
    tags: 'tags',
    users: 'users',
    products: 'products',
    cart: "cart"
} as const

export function connectToMongo(dbName: typeof dbList.basicSetting): {
    conn: Connection,
    models: {
        DB_category: Model<z.infer<typeof category_schema>>,
        DB_member: Model<z.infer<typeof member_schema>>,
        DB_tag: Model<z.infer<typeof tag_schema>>,
    }
}
export function connectToMongo(dbName: typeof dbList.products): {
    conn: Connection,
    models: {
        DB_product: Model<z.infer<typeof product_schema>>
    }
}
export function connectToMongo(dbName: typeof dbList.users): {
    conn: Connection,
    models: {
        DB_product: Model<z.infer<typeof product_schema>>
        DB_cart: Model<z.infer<typeof cart_schema>>
    }
}

export function connectToMongo(dbName: typeof dbList[keyof typeof dbList]) {
    const conn = mongoose.createConnection(`${process.env.MONGO_URL}`, {
        dbName
    })
    conn.once('connected', () => console.log(`connect to ${dbName} success !`))
    conn.once('close', () => console.log(`${dbName} closed !`))
    conn.on('error', (error) => console.log(`connect to ${dbName} fail !`, error))

    const models = {
        basicSetting: {
            DB_category: conn.model(collectionList.categories, DB_schemaList.basicSetting.categories),
            DB_member: conn.model(collectionList.members, DB_schemaList.basicSetting.members),
            DB_tag: conn.model(collectionList.tags, DB_schemaList.basicSetting.tags)
        },
        users: {
            DB_user: conn.model(collectionList.users, DB_schemaList.users),
            DB_cart: conn.model(collectionList.cart, DB_schemaList.cart)
        },
        products: {
            DB_product: conn.model(collectionList.products, DB_schemaList.products)
        }
    }

    return { conn, models: models[dbName] }
}