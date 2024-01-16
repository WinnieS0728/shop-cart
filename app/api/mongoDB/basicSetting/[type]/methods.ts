import { collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { queryClient } from "@/providers/react query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

function useGetMember() {
    return useQuery<
        z.infer<typeof member_schema>[]
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
        mutationFn: (data: z.infer<typeof member_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.members, 'GET'], (prev: z.infer<typeof member_schema>[]) => [...prev, variable].sort((a, b) => b.threshold - a.threshold))
        }
    })
}
function useUpdateMember() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.members, "PATCH"],
        mutationFn: (data: z.infer<typeof member_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.members, 'GET'], (prev: z.infer<typeof member_schema>[]) => prev.map(member => member._id === variable._id ? variable : member))
        }
    })
}
function useDeleteMember() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.members, 'DELETE'],
        mutationFn: (id: z.infer<typeof member_schema.shape._id>) => fetch(`/api/mongoDB/basicSetting/${collectionList.members}?id=${id}`, {
            method: "DELETE",
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.members, 'GET'], (prev: z.infer<typeof member_schema>[]) => prev.filter(member => member._id !== variable))
        }
    })
}



function useGetCategories() {
    return useQuery<z.infer<typeof category_schema>[]>({
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
        mutationFn: (data: z.infer<typeof category_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.categories, 'GET'], (prev: z.infer<typeof category_schema>[]) => [...prev, variable])
        },
    })
}
function useUpdateCategory() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.categories, "PATCH"],
        mutationFn: (data: z.infer<typeof category_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.categories, 'GET'], (prev: z.infer<typeof category_schema>[]) => prev.map(category => variable._id === category._id ? variable : category))
        }
    })
}
function useDeleteCategory() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.categories, "DELETE"],
        mutationFn: (id: z.infer<typeof category_schema.shape._id>) => fetch(`/api/mongoDB/basicSetting/${collectionList.categories}?id=${id}`, {
            method: "DELETE",
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.categories, 'GET'], (prev: z.infer<typeof category_schema>[]) => prev.filter(category => category._id !== variable))
        }
    })
}




function useGetTags() {
    return useQuery<z.infer<typeof tag_schema>[]>({
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
        mutationFn: (data: z.infer<typeof tag_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.tags, 'GET'], (prev: z.infer<typeof tag_schema>[]) => [...prev, variable])
        }
    })
}
function useUpdateTag() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.tags, "PATCH"],
        mutationFn: (data: z.infer<typeof tag_schema>) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.tags, 'GET'], (prev: z.infer<typeof tag_schema>[]) => prev.map(tag => tag._id === variable._id ? variable : tag))
        }
    })
}
function useDeleteTag() {
    return useMutation({
        mutationKey: ['admin', dbList.basicSetting, collectionList.tags, 'DELETE'],
        mutationFn: (id: z.infer<typeof tag_schema.shape._id>) => fetch(`/api/mongoDB/basicSetting/${collectionList.tags}?id=${id}`, {
            method: "DELETE",
        }),
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['admin', dbList.basicSetting, collectionList.tags, 'GET'], (prev: z.infer<typeof tag_schema>[]) => prev.filter(tag => tag._id !== variable))
        }
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





