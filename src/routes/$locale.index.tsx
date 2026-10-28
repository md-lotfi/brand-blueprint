import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Users } from "lucide-react";
import { pageHead } from "@/i18n/head";
import { useLocale, useT } from "@/i18n/use-locale";
import { siteConfig } from "@/config/site";
import { Arrow, DownloadButton, ExternalAction, PhoneMock, StoreBadges, btnOutline, linkSecondary, scrollToId } from "@/components/site/ui-bits";
import { ContactForm } from "@/components/site/ContactForm";
import plant from "@/assets/plant.jpg";
import brain from "@/assets/brain.jpg";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => pageHead(params.locale, "home"),
  component: Home,
});

function Home() {
  const t = useT();
  const locale = useLocale();
  const h = t.home;
  return (
    <>
      <section className="container-site grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="mb-4 font-bold tracking-wider text-primary rtl:tracking-normal">{h.slogan}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">{h.title}</h1>
          <p className="mt-6 max-w-[60ch] text-lg">{h.text}</p>
          <div className="mt-8 flex flex-col items-start gap-5">
            <DownloadButton />
            <Link to="/$locale/a-propos" params={{ locale }} className={linkSecondary}>{h.discover} <Arrow /></Link>
          </div>
        </div>
        <div className="relative flex min-h-[420px] items-center justify-center">
          <div aria-hidden className="blob absolute inset-4 bg-accent" />
          <img src={plant} alt="" width={800} height={1008} className="absolute bottom-0 end-0 w-40 opacity-90 mix-blend-multiply sm:w-56" />
          <div className="relative"><PhoneMock alt={t.ui.phoneAlt} /></div>
        </div>
      </section>

      <section className="bg-soft py-16 md:py-24">
        <div className="container-site">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl">{h.twoTitle}</h2>
            <span aria-hidden className="mx-auto mt-3 block h-1 w-12 rounded-full bg-brand" />
            <p className="mt-4 text-lg text-muted-foreground">{h.twoSub}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="grid size-16 place-items-center rounded-full bg-accent"><User aria-hidden className="size-8 text-primary" strokeWidth={1.5} /></span>
              <h3 className="text-2xl">{h.patTitle}</h3>
              <p className="font-bold text-primary">{h.patSub}</p>
              <p>{h.patText}</p>
              <div className="mt-2"><DownloadButton /></div>
              <div id="telecharger" className="mt-2 flex flex-col gap-3 border-t border-border pt-5 scroll-mt-32">
                <StoreBadges />
                <p className="text-sm text-muted-foreground">{h.availability}</p>
              </div>
            </article>
            <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="grid size-16 place-items-center rounded-full bg-accent"><Users aria-hidden className="size-8 text-primary" strokeWidth={1.5} /></span>
              <h3 className="text-2xl">{h.psyTitle}</h3>
              <p className="font-bold text-primary">{h.psySub}</p>
              <p>{h.psyText}</p>
              <div className="mt-2"><ExternalAction href={siteConfig.psychologistPortalUrl} className={btnOutline}>{h.psyAction} <Arrow /></ExternalAction></div>
              <a href="#contact" className={linkSecondary} onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>{h.contactTeam} <Arrow /></a>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="container-site grid scroll-mt-24 gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="relative">
          <p className="mb-3 font-bold tracking-wider text-primary rtl:tracking-normal">{h.contactSlogan}</p>
          <h2 className="text-3xl md:text-4xl">{h.contactTitle}</h2>
          <p className="mt-5 max-w-[55ch] text-lg">{h.contactText}</p>
          <img src={plant} alt="" loading="lazy" width={800} height={1008} className="mt-10 hidden w-48 mix-blend-multiply lg:block" />
        </div>
        <ContactForm />
      </section>

      <section className="bg-soft py-16 md:py-20">
        <div className="container-site grid items-center gap-10 md:grid-cols-[1fr_280px]">
          <div>
            <h2 className="text-3xl md:text-4xl">{t.about.title}</h2>
            <p className="mt-5 max-w-[60ch] text-lg">{t.about.text}</p>
            <p className="mt-4 max-w-[60ch] text-lg">{t.about.objective}</p>
            <Link to="/$locale/a-propos" params={{ locale }} className={`${linkSecondary} mt-6`}>{h.discover} <Arrow /></Link>
          </div>
          <img src={brain} alt="" loading="lazy" width={1008} height={912} className="mx-auto w-56 mix-blend-multiply md:w-full" />
        </div>
      </section>
    </>
  );
}
