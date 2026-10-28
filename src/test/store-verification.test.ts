import { describe, expect, it } from "vitest";
import { siteConfig, verifiedStores } from "@/config/site";

const configured = {
  ...siteConfig,
  appStoreUrl: "https://apps.apple.com/test-listing",
  appStoreBadges: { fr: "/official-fr.svg", en: "/official-en.svg", ar: null },
};

describe("Deferred store integrations", () => {
  it("never exposes a listing before verification", () => {
    expect(verifiedStores(configured, "fr")).toEqual([]);
  });
  it("requires an official badge for the current locale", () => {
    expect(verifiedStores({ ...configured, appStoreVerified: true }, "ar")).toEqual([]);
    expect(verifiedStores({ ...configured, appStoreVerified: true }, "fr")[0]?.badge).toBe("/official-fr.svg");
  });
  it("requires an actual configured store destination", () => {
    expect(verifiedStores({ ...configured, appStoreUrl: null, appStoreVerified: true }, "fr")).toEqual([]);
  });
});