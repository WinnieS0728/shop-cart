
import { password_schema, signUp_schema, user_schema } from "@/libs/mongoDB/schemas/user";
import { queryClient } from "@/providers/react query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

function useCreateUser() {
    return useMutation({
        mutationKey: ['admin', 'user', 'POST'],
        mutationFn: (data: z.infer<typeof signUp_schema>) => fetch("/api/mongoDB/users", {
            method: "POST",
            body: JSON.stringify(data),
        })
    })
}

function useUpdatePassword() {
    return useMutation({
        mutationKey: ['admin', 'user', 'PATCH', { action: 'updatePassword', key: 'email' }],
        mutationFn: async (data: z.infer<typeof password_schema>) => fetch(`/api/mongoDB/users/updatePassword/${data.email}`, {
            method: "PATCH",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify(data)
        }),
    })
}

function useUpdateUserData() {
    return useMutation({
        mutationKey: ['admin', 'user', 'PATCH', { action: 'updateUserData', key: 'email' }],
        mutationFn: async (data: z.infer<typeof user_schema>) => fetch(`/api/mongoDB/users/${data.email}`, {
            method: "PATCH",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify(data)
        }),
        onSuccess: (res, req) => {
            queryClient.setQueryData(["admin", "user", { key: "email", value: req.email }], req)
        }
    })
}

export function useUserMethods() {
    return {
        POST: useCreateUser(),
        UPDATE_PASSWORD: useUpdatePassword(),
        UPDATE_USER: useUpdateUserData()
    }
}