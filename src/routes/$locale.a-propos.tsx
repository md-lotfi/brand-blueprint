import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/i18n/head";
import { useT } from "@/i18n/use-locale";
import brain from "@/assets/brain.jpg";

export const Route = createFileRoute("/$locale/a-propos")({
  head: ({ params }) => pageHead(params.locale, "about"),
  component: About,
});

function About() {
  const t = useT();
  return (
    <section className="container-site grid items-center gap-12 py-16 md:py-28 lg:grid-cols-2">
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl">{t.about.title}</h1>
        <p className="mt-6 max-w-[60ch] text-lg">{t.about.text}</p>
        <p className="mt-5 max-w-[60ch] text-lg">{t.about.objective}</p>
      </div>
      <img src={brain} alt={t.ui.brainAlt} width={1008} height={912} className="mx-auto w-full max-w-md mix-blend-multiply" />
    </section>
  );
}
