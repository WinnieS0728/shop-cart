import { useEdgeStore } from "@/libs/edgestore/client";

type imageUrl = string | undefined
type edgeStoreFolder = keyof ReturnType<typeof useEdgeStore>['edgestore']

export function useImageMethods(folder: edgeStoreFolder) {
    const { edgestore } = useEdgeStore()

    async function confirmImage(url: string) {
        if (!url) {
            return
        }
        await edgestore[`${folder}`].confirmUpload({
            url
        })
    }

    async function deleteImage(url: string) {
        if (!url) {
            return
        };
        await edgestore[`${folder}`].delete({
            url
        })
    }


    async function imageProcess(before: imageUrl, after: imageUrl) {
        if (!before && !after) { // @ 都沒有
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


    return { confirmImage, imageProcess, deleteImage }
}