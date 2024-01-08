import { password_schema } from "@/app/admin/user/updatePassword/page";
import { signUp_schema } from "@/libs/mongoDB/models/user";
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
        })
    })
}
export function useUserMethods() {
    return {
        POST: useCreateUser(),
        UPDATE_PASSWORD: useUpdatePassword()
    }
}