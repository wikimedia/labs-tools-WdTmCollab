import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ja', 'fr', 'en', 'zh-Hans', 'zh-Hant'] as const,

  defaultLocale: 'en',

  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
