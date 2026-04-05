import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Success");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-primary">CanStack</p>
      <h1 className="font-[family-name:var(--font-display)] text-5xl text-slate-900">
        {t("title")}
      </h1>
      <p className="max-w-xl text-muted-foreground">{t("body")}</p>
      <Button asChild>
        <Link href={`/${locale}`}>{t("cta")}</Link>
      </Button>
    </main>
  );
}
