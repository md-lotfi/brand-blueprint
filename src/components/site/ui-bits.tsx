import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/use-locale";
import { siteConfig } from "@/config/site";
import logo from "@/assets/logo.svg";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src={logo} alt="" width={44} height={35} className="h-8 w-auto shrink-0" />
      <span dir="ltr" className="text-2xl font-bold text-deep">Mindcare</span>
    </span>
  );
}

export const Arrow = () => <ArrowRight aria-hidden className="size-4 shrink-0 rtl:-scale-x-100" />;

const pill = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-colors";
export const btnPrimary = cn(pill, "bg-primary text-primary-foreground hover:bg-deep");
export const btnOutline = cn(pill, "border-2 border-primary text-primary hover:bg-accent");
export const linkSecondary = "inline-flex items-center gap-2 font-bold text-primary hover:text-deep underline-offset-4 hover:underline";

/** Renders an external link, or a visibly unavailable control when the URL is not configured. */
export function ExternalAction({ href, className, children }: { href: string | null; className: string; children: ReactNode }) {
  const t = useT();
  if (!href) {
    return (
      <span role="link" aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-60")} title={t.ui.unavailable}>
        {children}
        <span className="sr-only"> ({t.ui.unavailable})</span>
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
  const t = useT();
  const cls = "inline-flex min-w-40 items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2 text-start shadow-soft";
  return (
    <div dir="ltr" className="flex flex-wrap gap-3 rtl:justify-end">
      <ExternalAction href={siteConfig.appStoreUrl} className={cls}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-6 fill-foreground"><path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.4-3.7zM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>
        <span className="text-sm font-bold leading-tight text-foreground">{t.ui.appStore}</span>
      </ExternalAction>
      <ExternalAction href={siteConfig.googlePlayUrl} className={cls}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-6"><path fill="#35B8CF" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z"/><path fill="#235789" d="m16.6 15.2-3.2-3.2 3.2-3.2 3.7 2.1c1 .6 1 1.6 0 2.2z"/><path fill="#8CE2EE" d="M13.4 12 3.6 2.3c.3-.2.8-.2 1.2 0l11.8 6.5z"/><path fill="#167b8e" d="m13.4 12 3.2 3.2-11.8 6.5c-.4.2-.9.2-1.2 0z"/></svg>
        <span className="text-sm font-bold leading-tight text-foreground">{t.ui.googlePlay}</span>
      </ExternalAction>
    </div>
  );
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}

export function DownloadButton({ target = "telecharger", outline }: { target?: string; outline?: boolean }) {
  const t = useT();
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
        <span dir="ltr" className="text-xl font-bold text-deep">Mindcare</span>
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
          <span dir="ltr" className="text-2xl font-bold text-deep">Mindcare</span>
        </div>
      </div>
      <div className="mx-[-6%] h-4 rounded-b-2xl bg-deep" />
    </div>
  );
}
