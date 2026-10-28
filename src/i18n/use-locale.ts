import { useParams } from "@tanstack/react-router";
import { dictionaries, isLocale, type Locale } from "./content";

export function useLocale(): Locale {
  const params = useParams({ strict: false }) as { locale?: string };
  return isLocale(params.locale) ? params.locale : "fr";
}

export function useT() {
  return dictionaries[useLocale()];
}

export type PageKey = "home" | "patients" | "psy" | "about";
export const pagePaths = {
  home: "/$locale",
  patients: "/$locale/patients",
  psy: "/$locale/psychologues",
  about: "/$locale/a-propos",
} as const;

export function pageFromPath(pathname: string): PageKey {
  if (pathname.includes("/patients")) return "patients";
  if (pathname.includes("/psychologues")) return "psy";
  if (pathname.includes("/a-propos")) return "about";
  return "home";
}
