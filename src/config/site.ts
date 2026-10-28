/**
 * Central configuration for every external destination and integration.
 * `null` means "not yet supplied" — the UI renders the control as visibly unavailable.
 * Fill these in before publishing. Never guess production URLs.
 */
export const siteConfig = {
  appStoreUrl: null as string | null,
  googlePlayUrl: null as string | null,
  patientEntryUrl: null as string | null,
  psychologistPortalUrl: null as string | null,
  resourcesUrl: null as string | null,
  privacyUrl: null as string | null,
  legalNoticeUrl: null as string | null,
  termsUrl: null as string | null,
  /** POST endpoint receiving JSON { name, email, phone, message, locale }. */
  contactEndpoint: null as string | null,
};
