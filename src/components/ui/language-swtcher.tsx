"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, type Locale, routing } from "@/src/i18n/routing";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;

    startTransition(() => {
      router.replace(
        { pathname },
        { locale: nextLocale }
      );
    });
  };

  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <span className="sr-only">{t("label")}</span>
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={handleChange}
        className="bg-transparent py-1 px-2 border rounded hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}