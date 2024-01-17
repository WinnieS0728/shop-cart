import { useEdgeStore } from "@/libs/edgestore";

type imageUrl = string | undefined
type edgeStoreFolder = keyof ReturnType<typeof useEdgeStore>['edgestore']

export function useImageMethods(folder: edgeStoreFolder) {
    const { edgestore } = useEdgeStore()

    async function confirmImage(url: string) {
        await edgestore[`${folder}`].confirmUpload({
            url
        })
    }

    async function imageProcess(before: imageUrl, after: imageUrl) {
        if (!before && !after) { // @ 都沒有
            return
        }
        if (!before && after) { // @ 原本沒有 後來有
            await edgestore[`${folder}`].confirmUpload({
                url: after,
            });
        } else if (before && !after) { // @ 原本有 後來沒有
            await edgestore[`${folder}`].delete({
                url: before,
            });
        } else if (
            before && after && after !== before
        ) { // @ 圖片更新
            await edgestore[`${folder}`].confirmUpload({
                url: after,
            });
            await edgestore[`${folder}`].delete({
                url: before,
            });
        }
    }


    return { confirmImage, imageProcess }
}