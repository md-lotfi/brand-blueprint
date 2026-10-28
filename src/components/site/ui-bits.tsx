import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/use-locale";
import { siteConfig, verifiedStores } from "@/config/site";
import logoAsset from "@/assets/mindcare-logo.svg.asset.json";
const logo = logoAsset.url;

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src={logo} alt="" width={44} height={35} className="h-8 w-auto shrink-0" />
      <span dir="ltr" className="font-sans text-2xl font-bold text-deep">Mindcare</span>
    </span>
  );
}

export const Arrow = () => <ArrowRight aria-hidden className="size-4 shrink-0 rtl:-scale-x-100" />;

const pill = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-colors";
export const btnPrimary = cn(pill, "bg-action text-action-foreground hover:bg-deep");
export const btnOutline = cn(pill, "border-2 border-action text-action hover:bg-accent");
export const linkSecondary = "inline-flex items-center gap-2 font-bold text-action hover:text-deep underline-offset-4 hover:underline";

/** Renders an external link, or a visibly unavailable control when the URL is not configured. */
export function ExternalAction({ href, className, children }: { href: string | null; className: string; children: ReactNode }) {
  if (!href) {
    return (
      <span role="link" aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-60")}>
        {children}
      </span>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function StoreBadges() {
  const locale = useLocale();
  const stores = verifiedStores(siteConfig, locale);
  if (!stores.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {stores.map((store) => store.badge && <ExternalAction key={store.name} href={store.href} className="inline-flex"><img src={store.badge} alt={store.name} className="h-12 w-auto" /></ExternalAction>)}
    </div>
  );
}

export function StoreAvailability() {
  const t = useT();
  const locale = useLocale();
  return verifiedStores(siteConfig, locale).length === 2 ? <p className="text-sm text-muted-foreground">{t.home.availability}</p> : null;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

export function DownloadButton({ target = "telecharger", outline }: { target?: string; outline?: boolean }) {
  const t = useT();
  const locale = useLocale();
  if (!verifiedStores(siteConfig, locale).length) return <ExternalAction href={null} className={outline ? btnOutline : btnPrimary}>{t.home.download} <Arrow /></ExternalAction>;
  return (
    <a href={`#${target}`} className={outline ? btnOutline : btnPrimary} onClick={(e) => { e.preventDefault(); scrollToId(target); }}>
      {t.home.download} <Arrow />
    </a>
  );
}

export function PhoneMock({ alt }: { alt: string }) {
  return (
    <div role="img" aria-label={alt} className="relative mx-auto aspect-[9/18] w-52 rounded-[2.5rem] border-[10px] border-deep bg-card shadow-soft sm:w-60">
      <div className="absolute inset-x-1/3 top-2 h-4 rounded-full bg-deep" />
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[1.8rem] bg-soft">
        <img src={logo} alt="" className="h-14 w-auto" />
        <span dir="ltr" className="font-sans text-xl font-bold text-deep">Mindcare</span>
      </div>
    </div>
  );
}

export function LaptopMock({ alt }: { alt: string }) {
  return (
    <div role="img" aria-label={alt} className="mx-auto w-full max-w-lg">
      <div className="aspect-[16/10] rounded-t-2xl border-[10px] border-deep bg-soft">
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <img src={logo} alt="" className="h-16 w-auto" />
          <span dir="ltr" className="font-sans text-2xl font-bold text-deep">Mindcare</span>
        </div>
      </div>
      <div className="mx-[-6%] h-4 rounded-b-2xl bg-deep" />
    </div>
  );
}
