"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, MoveLeft, Home } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">

      <div className="relative">
        <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
          <FileQuestion className="w-16 h-16 text-blue-600" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-500">
          {t("description")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto min-w-[140px]"
        >
          <MoveLeft className="mr-2 h-4 w-4" />
          {t("goBack")}
        </Button>

        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-w-[140px]">
            <Home className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </Link>
      </div>

      {/* Helpful Links Footer */}
      <div className="pt-8 border-t border-gray-100 w-full max-w-md">
        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">
          {t("popularDestinations")}
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium">
          <Link href="/actors" className="text-blue-600 hover:underline">
            {t("findActors")}
          </Link>
          <Link href="/compare" className="text-blue-600 hover:underline">
            {t("compare")}
          </Link>
          <Link href="/clusters" className="text-blue-600 hover:underline">
            {t("clusters")}
          </Link>
        </div>
      </div>
    </div>
  );
}