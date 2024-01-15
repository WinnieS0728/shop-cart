import { collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { categoriesSetting_Schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { memberSetting_Schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { tagSetting_Schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

function useGetMember() {
    return useQuery<
        z.infer<typeof memberSetting_Schema>["member"]
    >({
        queryKey: ['admin', dbList.basicSetting, collectionList.members, 'GET'],
        queryFn: async () => {
            const res = await fetch(`/api/mongoDB/basicSetting/${collectionList.members}`)
            if (!res.ok) {
                return []
            }
            return await res.json()
        }
    })
}
function useCreateMember() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.members, 'POST'],
        mutationFn: (data: z.infer<typeof memberSetting_Schema>["member"][number],) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useUpdateMember() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.members, "PATCH"],
        mutationFn: (data: z.infer<typeof memberSetting_Schema>["member"][number],) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useDeleteMember() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.members, 'DELETE'],
        mutationFn: (id: string) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}?id=${id}`, {
            method: "DELETE",
        })
    })
}



function useGetCategories() {
    return useQuery<z.infer<typeof categoriesSetting_Schema>['categories']>({
        queryKey: ['admin', dbList.basicSetting, collectionList.categories, 'GET'],
        queryFn: async () => {
            const res = await fetch(`/api/mongoDB/basicSetting/${collectionList.categories}`)
            if (!res.ok) {
                return []
            }
            return await res.json()
        }
    })
}
function useCreateCategory() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.categories, 'POST'],
        mutationFn: (data: z.infer<typeof categoriesSetting_Schema>['categories'][number]) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useUpdateCategory() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.categories, "PATCH"],
        mutationFn: (data: z.infer<typeof categoriesSetting_Schema>["categories"][number],) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useDeleteCategory() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.categories, "DELETE"],
        mutationFn: (id: string) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}?id=${id}`, {
            method: "DELETE",
        })
    })
}




function useGetTags() {
    return useQuery<z.infer<typeof tagSetting_Schema>['tags']>({
        queryKey: ['admin', dbList.basicSetting, collectionList.tags, 'GET'],
        queryFn: async () => {
            const res = await fetch(`/api/mongoDB/basicSetting/${collectionList.tags}`)
            if (!res.ok) {
                return []
            }
            return await res.json()
        }
    })
}
function useCreateTag() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.tags, 'POST'],
        mutationFn: (data: z.infer<typeof tagSetting_Schema>['tags'][number],) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useUpdateTag() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.tags, "PATCH"],
        mutationFn: (data: z.infer<typeof tagSetting_Schema>["tags"][number],) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}
function useDeleteTag() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.tags, 'DELETE'],
        mutationFn: (id: string) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}?id=${id}`, {
            method: "DELETE",
        })
    })
}

export function useBasicSettingMethods() {
    return {
        member: {
            GET: useGetMember(),
            POST: useCreateMember(),
            PATCH: useUpdateMember(),
            DELETE: useDeleteMember()
        },
        category: {
            GET: useGetCategories(),
            POST: useCreateCategory(),
            PATCH: useUpdateCategory(),
            DELETE: useDeleteCategory()
        },
        tag: {
            GET: useGetTags(),
            POST: useCreateTag(),
            PATCH: useUpdateTag(),
            DELETE: useDeleteTag()
        }
    }
}





