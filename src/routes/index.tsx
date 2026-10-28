import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$locale", params: { locale: "fr" } });
  },
  head: () => ({
    meta: [
      { title: "Mindcare — Un espace pour prendre soin de votre santé mentale" },
      { name: "description", content: "Mindcare, plateforme de téléconsultation en santé mentale en Algérie." },
      { property: "og:title", content: "Mindcare" },
      { property: "og:description", content: "Plateforme de téléconsultation en santé mentale en Algérie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
