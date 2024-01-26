import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { initEdgeStoreClient } from '@edgestore/server/core'

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
    userAvatar: es.imageBucket({
        maxSize: 1024 * 1024 * 5, // @ 5MB
    }).beforeDelete(() => true),
    productImage: es.imageBucket({
        maxSize: 1024 * 1024 * 10 // @ 10MB
    }).beforeDelete(() => true)
});

export const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export const edgestoreServer = initEdgeStoreClient({
    router: edgeStoreRouter
})

export type EdgeStoreRouter = typeof edgeStoreRouter;

type imageUrl = string | undefined
type edgeStoreFolder = keyof typeof edgeStoreRouter['buckets']

export function imageServerAction(folder: edgeStoreFolder) {

    async function confirmImage(url: string) {
        if (!url) {
            return
        }
        await edgestoreServer[`${folder}`].confirmUpload({
            url
        })
    }

    async function deleteImage(url: string) {
        if (!url) {
            return
        };
        await edgestoreServer[`${folder}`].deleteFile({
            url
        })
    }


    async function imageProcess(before: imageUrl, after: imageUrl) {
        if (!before && !after) { // @ 都沒有
            return
        }
        if (before && after && before === after) { // @ 沒變
            return
        }
        if (!before && after) { // @ 原本沒有 後來有
            await confirmImage(after)
        } else if (before && !after) { // @ 原本有 後來沒有
            await deleteImage(before)
        } else if (
            before && after && after !== before
        ) { // @ 圖片更新
            await confirmImage(after)
            await deleteImage(before)
        }
    }


    return { confirmImage, deleteImage, imageProcess }
}
