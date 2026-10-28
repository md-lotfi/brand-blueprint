import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import { pageHead } from "@/i18n/head";
import { useLocale, useT } from "@/i18n/use-locale";
import { siteConfig } from "@/config/site";
import { Link } from "@tanstack/react-router";
import { Arrow, ExternalAction, LaptopMock, btnPrimary, linkSecondary, scrollToId } from "@/components/site/ui-bits";
import psyImg from "@/assets/psychologist.jpg";

export const Route = createFileRoute("/$locale/psychologues")({
  head: ({ params }) => pageHead(params.locale, "psy"),
  component: Psychologists,
});

const icons = [Sparkles, CalendarDays, ShieldCheck, LayoutDashboard];

function Psychologists() {
  const t = useT();
  const locale = useLocale();
  const p = t.psy;
  return (
    <>
      <section className="container-site grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl">{p.title}</h1>
          <p className="mt-6 max-w-[60ch] text-lg">{p.text}</p>
          <div className="mt-8 flex flex-col items-start gap-5">
            <ExternalAction href={siteConfig.psychologistPortalUrl} className={btnPrimary}>{p.action} <Arrow /></ExternalAction>
            <a href="#fonctionnalites" className={linkSecondary} onClick={(e) => { e.preventDefault(); scrollToId("fonctionnalites"); }}>{p.discover} <Arrow /></a>
          </div>
        </div>
        <div className="relative flex min-h-[360px] items-center justify-center">
          <div aria-hidden className="blob absolute inset-4 bg-accent" />
          <div className="relative w-full px-6"><LaptopMock alt={t.ui.laptopAlt} /></div>
        </div>
      </section>

      <section id="fonctionnalites" className="scroll-mt-24 bg-soft py-16 md:py-24">
        <div className="container-site">
          <h2 className="text-center text-3xl md:text-4xl">{p.capTitle}</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {p.caps.map(([title, text], i) => {
              const Icon = icons[i];
              return (
                <li key={title} className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <span className="grid size-12 place-items-center rounded-full bg-accent"><Icon aria-hidden className="size-6 text-primary" strokeWidth={1.5} /></span>
                  <h3 className="text-lg">{title}</h3>
                  <p>{text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <div className="grid items-center gap-8 rounded-3xl bg-accent p-8 md:grid-cols-[1fr_280px] md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl">{p.closeTitle}</h2>
            <p className="mt-5 max-w-[55ch] text-lg">{p.closeText}</p>
            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <ExternalAction href={siteConfig.psychologistPortalUrl} className={btnPrimary}>{p.action} <Arrow /></ExternalAction>
              <Link to="/$locale" params={{ locale }} hash="contact" className={linkSecondary}>{t.home.contactTeam} <Arrow /></Link>
            </div>
          </div>
          <img src={psyImg} alt={t.ui.psyAlt} loading="lazy" width={912} height={912} className="mx-auto w-56 rounded-2xl mix-blend-multiply md:w-full" />
        </div>
      </section>
    </>
  );
}
