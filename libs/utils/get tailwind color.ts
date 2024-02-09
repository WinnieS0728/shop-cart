import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'

const { theme: { colors } } = resolveConfig(tailwindConfig)

type colorName_returnValue = {
    [K in keyof typeof colors]: typeof colors[K] extends string ? K : never
}[keyof typeof colors]
type colorName_returnObj = {
    [K in keyof typeof colors]: typeof colors[K] extends object ? K : never
}[keyof typeof colors]

export function getTailwindColor<C extends colorName_returnValue>(colorName: C): typeof colors[C]
export function getTailwindColor<C extends colorName_returnObj>(colorName: C, scale: keyof typeof colors[C]): typeof colors[C][keyof typeof colors[C]]

export function getTailwindColor<C extends colorName_returnValue | colorName_returnObj>(colorName: C, scale?: keyof typeof colors[C]) {

    if (scale) {
        return colors[colorName][scale]
    }

    return colors[colorName]
}