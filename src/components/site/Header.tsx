import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, Menu, User, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { locales, localeNames } from "@/i18n/content";
import { pageFromPath, pagePaths, useLocale, useT, type PageKey } from "@/i18n/use-locale";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ExternalAction, Logo, btnOutline } from "./ui-bits";

export function Header() {
  const t = useT();
  const locale = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = pageFromPath(pathname);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items: [PageKey, string][] = [["home", t.nav.home], ["patients", t.nav.patients], ["psy", t.nav.psy], ["about", t.nav.about]];
  const linkCls = (k: PageKey) =>
    `border-b-2 py-1 transition-colors ${current === k ? "border-brand text-action font-bold" : "border-transparent text-foreground hover:text-action"}`;

  const navLinks = (onClick?: () => void) => (
    <>
      {items.map(([k, label]) => (
        <Link key={k} to={pagePaths[k]} params={{ locale }} className={linkCls(k)} aria-current={current === k ? "page" : undefined} onClick={onClick}>
          {label}
        </Link>
      ))}
      <ExternalAction href={siteConfig.resourcesUrl} className="border-b-2 border-transparent py-1 text-foreground">{t.nav.resources}</ExternalAction>
    </>
  );

  const langSwitch = (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm hover:bg-accent" aria-label={t.ui.language}>
        <Globe aria-hidden className="size-4" /> <span className="uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l} asChild>
            <Link to={pagePaths[current]} params={{ locale: l }} lang={l} aria-current={l === locale ? "true" : undefined} className={l === locale ? "font-bold" : ""}>
              {localeNames[l]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container-site grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:flex lg:justify-between">
        <Link to="/$locale" params={{ locale }} aria-label="Mindcare" className="min-w-0"><Logo /></Link>
        <nav aria-label={t.ui.menu} className="hidden items-center gap-6 text-sm lg:flex">{navLinks()}</nav>
        <div className="flex shrink-0 items-center gap-2">
          {langSwitch}
          <Button variant="outline" onClick={() => setLoginOpen(true)} className={`${btnOutline} hidden h-auto px-5 py-2 text-sm sm:inline-flex`}>{t.nav.login}</Button>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)} className="rounded-full lg:hidden" aria-label={t.ui.menu}>
            <Menu aria-hidden className="size-6" />
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side={locale === "ar" ? "left" : "right"} aria-describedby={undefined} className="flex flex-col gap-6 p-6 [&>button:first-child]:hidden">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">{t.ui.menu}</SheetTitle>
            <SheetClose className="rounded-full p-2 hover:bg-accent" aria-label={t.ui.close}><X aria-hidden className="size-5" /></SheetClose>
          </div>
          <nav className="flex flex-col gap-4 text-base">{navLinks(() => setMenuOpen(false))}</nav>
          <Button variant="outline" onClick={() => { setMenuOpen(false); setLoginOpen(true); }} className={`${btnOutline} h-auto whitespace-normal`}>{t.nav.login}</Button>
        </SheetContent>
      </Sheet>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-deep">{t.ui.loginTitle}</DialogTitle>
            <DialogDescription>{t.ui.loginDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {([[t.ui.patient, siteConfig.patientEntryUrl, User], [t.ui.psychologist, siteConfig.psychologistPortalUrl, Users]] as const).map(([label, url, Icon]) => (
              <ExternalAction key={label} href={url} className="flex flex-col items-center gap-2 rounded-2xl border border-border p-5 font-bold text-deep hover:bg-accent">
                <Icon aria-hidden className="size-7 text-brand" strokeWidth={1.5} /> {label}
              </ExternalAction>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
