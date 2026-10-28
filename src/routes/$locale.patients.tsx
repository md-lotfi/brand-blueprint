import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CalendarCheck, Search, UserRound, Video } from "lucide-react";
import { pageHead } from "@/i18n/head";
import { useT } from "@/i18n/use-locale";
import { DownloadButton, PhoneMock, StoreBadges, StoreAvailability } from "@/components/site/ui-bits";
import calm from "@/assets/calm.jpg";
import plant from "@/assets/plant.jpg";

export const Route = createFileRoute("/$locale/patients")({
  head: ({ params }) => pageHead(params.locale, "patients"),
  component: Patients,
});

const icons = [Search, CalendarCheck, Video, UserRound, BookOpen];

function Patients() {
  const t = useT();
  const p = t.patients;
  return (
    <>
      <section className="container-site grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl">{p.title}</h1>
          <p className="mt-6 max-w-[60ch] text-lg">{p.text}</p>
          <div className="mt-8"><DownloadButton /></div>
          <div id="telecharger" className="mt-8 flex scroll-mt-32 flex-col gap-3">
            <StoreBadges />
            <StoreAvailability />
          </div>
        </div>
        <div className="relative flex min-h-[420px] items-center justify-center">
          <div aria-hidden className="blob absolute inset-6 bg-accent" />
          <img src={plant} alt="" width={800} height={1008} className="absolute bottom-0 start-0 w-36 mix-blend-multiply sm:w-48" />
          <div className="relative"><PhoneMock alt={t.ui.phoneAlt} /></div>
        </div>
      </section>

      <section className="bg-soft py-16 md:py-24">
        <div className="container-site">
          <h2 className="mx-auto max-w-3xl text-center text-3xl md:text-4xl">{p.capTitle}</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {p.caps.map(([title, text], i) => {
              const Icon = icons[i] ?? Search;
              return (
                <li key={title} className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <span className="grid size-12 place-items-center rounded-full bg-accent"><Icon aria-hidden className="size-6 text-primary" strokeWidth={1.5} /></span>
                  <h3 className="text-lg">{title}</h3>
                  <p className="text-base">{text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-soft md:grid-cols-2">
          <img src={calm} alt={t.ui.calmAlt} loading="lazy" width={1008} height={800} className="h-full w-full object-cover" />
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl">{p.closeTitle}</h2>
            <p className="mt-5 max-w-[55ch] text-lg">{p.closeText}</p>
            <div className="mt-8"><DownloadButton /></div>
          </div>
        </div>
      </section>
    </>
  );
}
