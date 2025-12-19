'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type Locale, routing, usePathname, useRouter } from '../../i18n/routing'

const languageNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
}

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="space-y-4">
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{t('selectLanguage')}</p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {routing.locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
              ${locale === lang
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
            type="button"
          >
            {languageNames[lang]}
          </button>
        ))}
      </div>
    </div>
  )
}
