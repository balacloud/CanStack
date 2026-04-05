import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { pricingPlans } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Pricing");

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            CanStack
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-slate-900">
            {t("title")}
          </h1>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/${locale}`}>{t("back")}</Link>
        </Button>
      </div>
      <section className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.tier} className="border-slate-900/10 bg-white/80">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-semibold">{plan.priceCad}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button className="w-full">{t("cta")}</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
