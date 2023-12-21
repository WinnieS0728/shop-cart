import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'
import { DefaultColors } from 'tailwindcss/types/generated/colors'

const { theme: { colors } } = resolveConfig(tailwindConfig)

export function getTailwindColor<C>(colorName: keyof C, scale: keyof colors[]) {
    console.log(colors[colorName]);
    return colors[colorName]
}