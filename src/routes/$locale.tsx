import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLocale } from "@/i18n/content";
import { useT } from "@/i18n/use-locale";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const t = useT();
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {t.ui.skip}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
