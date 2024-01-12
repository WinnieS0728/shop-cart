import { collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

function useGETproducts() {
    return useQuery<z.infer<typeof product_schema>[]>({
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

function usePOSTproduct() {
    return useMutation({
        mutationKey: [dbList.products, collectionList.products, "POST"],
        mutationFn: (data: z.infer<typeof product_schema>) => fetch('/api/mongoDB/products', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    })
}



export function useProductMethods() {
    return {
        GET: useGETproducts(),
        POST: usePOSTproduct()
    }
}