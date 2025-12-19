import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "de", "it"],
  defaultLocale: "en",
  localeDetection: true // This enables the auto-detection you asked for
});

export type Locale = (typeof routing.locales)[number];

// These are the wrappers we need for the Language Switcher
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);