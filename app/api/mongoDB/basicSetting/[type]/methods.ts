import { categoriesSetting_Schema } from "@/libs/mongoDB/models/basic setting/category";
import { memberSetting_Schema } from "@/libs/mongoDB/models/basic setting/member";
import { tagSetting_Schema } from "@/libs/mongoDB/models/basic setting/tag";
import { Types } from "mongoose";
import { z } from "zod";

export async function createMember(
    data: z.infer<typeof memberSetting_Schema>["member"][number],
) {
    return fetch(`/api/mongoDB/basicSetting/member`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
export async function updateMember(
    data: z.infer<typeof memberSetting_Schema>["member"][number],
) {
    return fetch(`/api/mongoDB/basicSetting/member`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
export async function deleteMember(id: Types.ObjectId) {
    return fetch(`/api/mongoDB/basicSetting/member?id=${id}`, {
        method: "DELETE",
    });
}


export async function createCategory(
    data: z.infer<typeof categoriesSetting_Schema>['categories'][number],
) {
    return fetch(`/api/mongoDB/basicSetting/category`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function updateCategory(
    data: z.infer<typeof categoriesSetting_Schema>['categories'][number],
) {
    return fetch(`/api/mongoDB/basicSetting/category`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function deleteCategory(id: Types.ObjectId) {
    return fetch(`/api/mongoDB/basicSetting/category?id=${id}`, {
        method: "DELETE",
    });
}

export async function createTag(
    data: z.infer<typeof tagSetting_Schema>['tags'][number],
) {
    return fetch(`/api/mongoDB/basicSetting/tag`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function updateTag(
    data: z.infer<typeof tagSetting_Schema>['tags'][number],
) {
    return fetch(`/api/mongoDB/basicSetting/tag`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function deleteTag(id: Types.ObjectId) {
    return fetch(`/api/mongoDB/basicSetting/tag?id=${id}`, {
        method: "DELETE",
    });
}