import { UpdateOptions, TypeOptions, Icons } from "react-toastify";

export function toastOptions(type: TypeOptions): UpdateOptions {
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


    return {
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        draggable: 'touch',
        ...dynamicProps[type]
    }
}