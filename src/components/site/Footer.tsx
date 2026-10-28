import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { useLocale, useT } from "@/i18n/use-locale";
import { ExternalAction, Logo } from "./ui-bits";

export function Footer() {
  const t = useT();
  const locale = useLocale();
  const cls = "text-sm text-foreground hover:text-action";
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-site flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">{t.footer.brand}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          <ExternalAction href={siteConfig.privacyUrl} className={cls}>{t.footer.privacy}</ExternalAction>
          <ExternalAction href={siteConfig.legalNoticeUrl} className={cls}>{t.footer.legal}</ExternalAction>
          <ExternalAction href={siteConfig.termsUrl} className={cls}>{t.footer.terms}</ExternalAction>
          <Link to="/$locale" params={{ locale }} hash="contact" className={cls}>{t.footer.contact}</Link>
        </nav>
      </div>
    </footer>
  );
}
