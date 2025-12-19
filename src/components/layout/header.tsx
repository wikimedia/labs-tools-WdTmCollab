import Link from "next/link";
import { useTranslations } from "next-intl";
import Navigation from "./navigation";
import SkipNav from "./skip-nav";
import { ThemeToggle } from "../ui/theme-toggle";

export default function Header() {
  const t = useTranslations("navigation");

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href='/'
          className='flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded'
          aria-label={t("homeAriaLabel")}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-8 w-8 text-blue-600'
            aria-hidden="true"
            focusable="false"
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
            <path d='M12 17h.01' />
          </svg>
          <span className='text-xl font-bold'>{t("brandName")}</span>
        </Link>
        <Navigation />
        <ThemeToggle />
        <SkipNav />
      </div>
    </header>
  );
}