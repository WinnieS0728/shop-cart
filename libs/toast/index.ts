import { UpdateOptions, TypeOptions, Icons, Id, toast } from "react-toastify";

const dynamicProps: Record<TypeOptions, UpdateOptions> = {
    default: {
        type: 'default',
        icon: Icons.spinner
    },
    success: {
        type: 'success',
        icon: Icons.success
    },
    info: {
        type: 'info',
        icon: Icons.info
    },
    warning: {
        type: "info",
        icon: Icons.info
    },
    error: {
        type: 'error',
        icon: Icons.error
    }
}
export function updateToast(toastId: Id, type: TypeOptions, options?: UpdateOptions) {
    toast.update(toastId, {
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        draggable: 'touch',
        ...dynamicProps[type],
        ...options
    })
}