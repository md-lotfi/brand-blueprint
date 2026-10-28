/**
 * Central configuration for every external destination and integration.
 * `null` means "not yet supplied" — the UI renders the control as visibly unavailable.
 * Fill these in before publishing. Never guess production URLs.
 */
export const siteConfig = {
  appStoreUrl: null as string | null,
  googlePlayUrl: null as string | null,
  /** Enable only after checking the actual listing; badges must be official and localized. */
  appStoreVerified: false,
  googlePlayVerified: false,
  appStoreBadges: { fr: null, en: null, ar: null } as Record<"fr" | "en" | "ar", string | null>,
  googlePlayBadges: { fr: null, en: null, ar: null } as Record<"fr" | "en" | "ar", string | null>,
  patientEntryUrl: null as string | null,
  psychologistPortalUrl: null as string | null,
  resourcesUrl: null as string | null,
  privacyUrl: null as string | null,
  legalNoticeUrl: null as string | null,
  termsUrl: null as string | null,
  /** POST endpoint receiving JSON { name, email, phone, message, locale }. */
  contactEndpoint: null as string | null,
};

export function verifiedStores(config: Pick<typeof siteConfig, "appStoreUrl" | "googlePlayUrl" | "appStoreVerified" | "googlePlayVerified" | "appStoreBadges" | "googlePlayBadges">, locale: "fr" | "en" | "ar") {
  return [
    { name: "App Store", href: config.appStoreUrl, badge: config.appStoreBadges[locale], verified: config.appStoreVerified },
    { name: "Google Play", href: config.googlePlayUrl, badge: config.googlePlayBadges[locale], verified: config.googlePlayVerified },
  ].filter((store) => store.verified && store.href && store.badge);
}
