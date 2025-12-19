"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  type Locale,
  routing,
  usePathname,
  useRouter,
} from "../../i18n/routing";
import { Globe } from "lucide-react";

const languageNames: Record<Locale, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
};

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <select
        defaultValue={locale}
        className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 cursor-pointer"
        aria-label={t("label")}
      >
        {Object.entries(languageNames).map(([key, name]) => (
          <option
            key={key}
            value={key}
            onClick={() => handleLanguageChange(key as Locale)}
          >
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
