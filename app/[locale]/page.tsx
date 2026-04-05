import { getTranslations } from "next-intl/server";
import { CanStackApp } from "@/components/canstack-app";

export default async function LocaleHomePage() {
  const t = await getTranslations("Home");

  return <CanStackApp title={t("title")} subtitle={t("subtitle")} />;
}
