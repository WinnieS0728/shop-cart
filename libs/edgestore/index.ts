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