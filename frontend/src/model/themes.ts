const _themeArrayConst = ['dark'] as const
const theme_array = [..._themeArrayConst]
type ThemeType = (typeof _themeArrayConst)[number]

const default_theme: ThemeType = 'dark'

export type { ThemeType }
export { theme_array, default_theme }
