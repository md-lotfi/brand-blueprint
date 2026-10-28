import { dictionaries, isLocale } from "./content";

export function pageHead(locale: string, key: "home" | "patients" | "psy" | "about") {
  const [title, description] = dictionaries[isLocale(locale) ? locale : "fr"].meta[key];
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
