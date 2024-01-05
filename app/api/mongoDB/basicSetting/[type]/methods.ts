import { categoriesSetting_Schema } from "@/libs/mongoDB/models/basic setting/category";
import { memberSetting_Schema } from "@/libs/mongoDB/models/basic setting/member";
import { tagSetting_Schema } from "@/libs/mongoDB/models/basic setting/tag";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

function useCreateMember() {
    return useMutation({
        mutationKey: ['admin', 'basicSetting', 'member', 'POST'],
        mutationFn: (data: z.infer<typeof memberSetting_Schema>["member"][number],) => fetch(`/api/mongoDB/basicSetting/member`, {
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
        mutationKey: ['admin', 'basicSetting', 'member', "PATCH"],
        mutationFn: (data: z.infer<typeof memberSetting_Schema>["member"][number],) => fetch(`/api/mongoDB/basicSetting/member`, {
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
        mutationKey: ['admin', 'basicSetting', 'member', 'DELETE'],
        mutationFn: (title: string) => fetch(`/api/mongoDB/basicSetting/member?title=${title}`, {
            method: "DELETE",
        })
    })
}

function useCreateCategory() {
    return useMutation({
        mutationKey: ['admin', 'basicSetting', 'category', 'POST'],
        mutationFn: (data: z.infer<typeof categoriesSetting_Schema>['categories'][number]) => fetch(`/api/mongoDB/basicSetting/category`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}

function useDeleteCategory() {
    return useMutation({
        mutationKey: ['admin', 'basicSetting', 'category', "DELETE"],
        mutationFn: (title: string) => fetch(`/api/mongoDB/basicSetting/category?title=${title}`, {
            method: "DELETE",
        })
    })
}

function useCreateTag() {
    return useMutation({
        mutationKey: ['admin', 'basicSetting', 'tag', 'POST'],
        mutationFn: (data: z.infer<typeof tagSetting_Schema>['tags'][number],) => fetch(`/api/mongoDB/basicSetting/tag`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
    })
}

function useDeleteTag() {
    return useMutation({
        mutationKey: ['admin', 'basicSetting', 'tag', 'DELETE'],
        mutationFn: (title: string) => fetch(`/api/mongoDB/basicSetting/tag?title=${title}`, {
            method: "DELETE",
        })
    })
}

export function useBasicSetting() {
    return {
        member: {
            POST: useCreateMember(),
            PATCH: useUpdateMember(),
            DELETE: useDeleteMember()
        },
        category: {
            POST: useCreateCategory(),
            DELETE: useDeleteCategory()
        },
        tag: {
            POST: useCreateTag(),
            DELETE: useDeleteTag()
        }
    }
}





