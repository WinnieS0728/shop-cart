import { edgeStoreRouter } from "@/libs/edgestore";
import { edgestoreProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { serverCaller } from "..";

type edgeStoreFolder = keyof typeof edgeStoreRouter['buckets']

const edgestore_inputSchema = z.object({
    folder: z.custom<edgeStoreFolder>(),
    url: z.string().nullish()
})

export const edgestoreRouter = router({
    confirmImage: edgestoreProcedure
        .input(edgestore_inputSchema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { folder, url } = input
            const { edgestoreServer } = ctx

            try {
                if (!url) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此照片 !'
                    })
                }
                await edgestoreServer[`${folder}`].confirmUpload({
                    url
                })
                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        cause: error
                    })
                }
            }
        }),
    deleteImage: edgestoreProcedure
        .input(edgestore_inputSchema)
        .output(z.string())
        .mutation(async ({ input, ctx }) => {
            const { folder, url } = input
            const { edgestoreServer } = ctx

            try {
                if (!url) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '查無此照片 !'
                    })
                }
                await edgestoreServer[`${folder}`].deleteFile({
                    url
                })
                return 'ok'
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        cause: error
                    })
                }
            }
        }),
    imageProcess: edgestoreProcedure
        .input(edgestore_inputSchema.merge(z.object({
            url: z.object({
                before: z.string().nullish(),
                after: z.string().nullish()
            })
        })))
        .output(z.string())
        .mutation(async ({ input }) => {
            const { folder, url: { before, after } } = input

            try {
                if (!before && !after) { // @ 都沒有
                    return 'nothing change'
                }
                if (before && after && before === after) { // @ 沒變
                    return 'nothing change'
                }

                if (!before && after) { // @ 原本沒有 後來有
                    await serverCaller.edgestore.confirmImage({
                        folder,
                        url: after
                    })
                } else if (before && !after) { // @ 原本有 後來沒有
                    await serverCaller.edgestore.deleteImage({
                        folder,
                        url: before
                    })
                } else if (
                    before && after && after !== before
                ) { // @ 圖片更新
                    await serverCaller.edgestore.confirmImage({
                        folder,
                        url: after
                    })
                    await serverCaller.edgestore.deleteImage({
                        folder,
                        url: before
                    })
                }

                return 'ok'
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    cause: error
                })
            }
        })
})