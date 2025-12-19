import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("common");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-solid border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600 font-medium">{t("loading")}</p>
      </div>
    </div>
  );
}
