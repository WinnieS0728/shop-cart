import { collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { queryClient } from "@/providers/react query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const populated_schema = z.object({
    categories: z.array(category_schema),
    tags: z.array(tag_schema)
})
export const product_listSchema = product_schema.merge(populated_schema)

function useGETproducts() {
    return useQuery<z.infer<typeof product_listSchema>[]>({
        queryKey: [dbList.products, collectionList.products, "GET"],
        queryFn: async () => {
            const res = await fetch('/api/mongoDB/products')
            if (!res.ok) {
                return []
            }
            return await res.json()
        }
    })
}

function useGEToneProducts(id: string) {
    return useQuery<z.infer<typeof product_listSchema>>({
        queryKey: [dbList.products, collectionList.products, "GET", {
            id
        }],
        queryFn: async () => {
            const res = await fetch(`/api/mongoDB/products?id=${id}`)
            if (!res.ok) {
                return undefined
            }
            return await res.json()
        }
    })
}

function usePOSTproduct() {
    return useMutation({
        mutationKey: [dbList.products, collectionList.products, "POST"],
        mutationFn: (data: z.infer<typeof product_schema>) => fetch('/api/mongoDB/products', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }),
    })
}

function usePATCHproduct() {
    return useMutation({
        mutationKey: [dbList.products, collectionList.products, "PATCH"],
        mutationFn: (data: z.infer<typeof product_schema>) => fetch(`/api/mongoDB/products`, {
            method: "PATCH",
            headers: {
                "Content-types": "application/json"
            },
            body: JSON.stringify(data)
        }),
    })
}



export function useProductMethods() {
    return {
        GET: useGETproducts(),
        GETbyId: useGEToneProducts,
        POST: usePOSTproduct(),
        PATCH: usePATCHproduct(),
    }
}