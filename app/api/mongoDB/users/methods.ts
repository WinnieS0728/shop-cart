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

export function useUserSetting() {
    return {
        POST: useCreateUser()
    }
}