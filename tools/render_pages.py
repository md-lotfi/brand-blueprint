#!/usr/bin/env python3
"""Generate root-level static pages using only the Python standard library."""
import html
import json
import os
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
T = json.loads((ROOT / 'content/translations.json').read_text())
C = json.loads((ROOT / 'src/config/site.ts').read_text().split('export const siteConfig =', 1)[1].strip().removesuffix(';'))
PAGES = {'home': '', 'patients': 'patients/', 'psy': 'psychologues/', 'about': 'a-propos/'}
NAMES = {'fr': 'Français', 'en': 'English', 'ar': 'العربية'}
e = lambda s: html.escape(str(s), quote=True)

def icon(symbol):
    paths={
        '♙':'<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
        '♧':'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m2-17a3 3 0 0 1 0 6m1 5a5 5 0 0 1 3 4v2"/>',
        '⌕':'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
        '▦':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-11 5 2 2 4-4"/>',
        '▷':'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
        '▤':'<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-3-1-7-1-10 1V5"/>',
        '✧':'<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>',
        '◇':'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>'
    }
    return '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[symbol]+'</svg>'

def render_all():
    if C['publicOrigin']:
        parsed = urlparse(C['publicOrigin'])
        if parsed.scheme not in ('https', 'http') or not parsed.netloc or parsed.query or parsed.fragment:
            raise ValueError('publicOrigin must be an absolute HTTP(S) URL without query or fragment')
    output = {}
    for locale, t in T.items():
        for page, slug in PAGES.items():
            dest = f'{locale}/{slug}index.html'
            directory = Path(dest).parent
            def url(path):
                return os.path.relpath(path, directory) + ('/' if str(path).endswith('/') else '')
            def route(lang=locale, key='home'):
                return url(f'{lang}/{PAGES[key]}')
            def image(name, cls='', lazy=True):
                sizes = {'plant.jpg': (800,1008), 'brain.jpg': (1008,912), 'calm.jpg': (1008,800), 'psychologist.jpg': (912,912), 'mindcare-logo.svg': (222,175)}
                w,h = sizes[name]
                return f'<img src="{e(url("assets/"+name))}" alt="" width="{w}" height="{h}" class="{cls}"'+ (' loading="lazy"' if lazy else '')+'>'
            def action(key, text, cls='button'):
                href = C.get(key)
                if not href:
                    return f'<span role="link" aria-disabled="true" class="{cls} unavailable">{e(text)}</span>'
                return f'<a href="{e(href)}" class="{cls}" target="_blank" rel="noopener noreferrer">{e(text)}</a>'
            def logo():
                return f'<span class="logo">{image("mindcare-logo.svg",lazy=False)}<bdi class="latin">Mindcare</bdi></span>'
            stores = [(name,C[key+'Badges'].get(locale)) for name,key in [('App Store','appStore'),('Google Play','googlePlay')] if C.get(key+'Verified') and C.get(key+'Url') and C[key+'Badges'].get(locale)]
            # Use only confirmed listings and official localized badge assets.
            badges = ''.join(f'<a href="{e(C["appStoreUrl"] if name == "App Store" else C["googlePlayUrl"])}" target="_blank" rel="noopener noreferrer"><img class="store-badge" src="{e(badge if urlparse(badge).scheme else url(badge))}" alt="{e(name)}"></a>' for name,badge in stores)
            availability = f'<p class="muted">{e(t["home"]["availability"])}</p>' if len(stores)==2 else ''
            download = (f'<a class="button" href="{"#telecharger" if page in ("home", "patients") else route(key="patients")+"#telecharger"}">{e(t["home"]["download"])}</a>' if stores else f'<span role="link" aria-disabled="true" class="button unavailable">{e(t["home"]["download"])}</span>')
            def mock(kind):
                return f'<div class="device-scene"><div class="blob"></div><div class="{kind}" role="img" aria-label="{e(t["ui"]["phoneAlt" if kind=="phone" else "laptopAlt"])}"><div>{logo()}</div></div>'+ (image('plant.jpg','plant',False) if kind=='phone' else '')+'</div>'
            def text(tag, value, cls=''):
                return f'<{tag} class="{cls}">{e(value)}</{tag}>'
            def link(key, label):
                return f'<a class="text-link" href="{route(key=key)}">{e(label)} <span aria-hidden="true">→</span></a>'
            def caps(data, symbols):
                return '<ul class="cards features">'+''.join(f'<li><span class="icon" aria-hidden="true">{icon(symbols[i])}</span>{text("h3",title)}{text("p",body)}</li>' for i,(title,body) in enumerate(data))+'</ul>'
            h = t['home']
            if page=='home':
                form = '<form class="contact-form" data-contact-form>'+''.join(f'<div><label for="cf-{k}">{e(t["form"][k])}</label>'+ (f'<textarea id="cf-{k}" name="{k}" rows="4" required dir="auto"></textarea>' if k=='message' else f'<input id="cf-{k}" name="{k}" type="{typ}" autocomplete="{ac}" dir="{direction}" {"required" if k!="phone" else ""}>')+'</div>' for k,typ,ac,direction in [('name','text','name','auto'),('email','email','email','ltr'),('phone','tel','tel','ltr'),('message','','','auto')])+f'<button class="button" type="submit" disabled aria-disabled="true">{e(t["form"]["submit"])}</button><p role="status" aria-live="polite"></p></form>'
                body = f'<section class="container hero"><div>{text("p",h["slogan"],"eyebrow")}{text("h1",h["title"])}{text("p",h["text"],"lead")}<div class="actions">{download}{link("about",h["discover"])}</div></div>{mock("phone")}</section>'
                body += f'<section class="soft section"><div class="container"><div class="section-heading">{text("h2",h["twoTitle"])}<span class="rule"></span>{text("p",h["twoSub"],"lead muted")}</div><div class="cards two">'
                for k,symbol in [('pat','♙'),('psy','♧')]:
                    body+=f'<article><span class="icon" aria-hidden="true">{icon(symbol)}</span>{text("h3",h[k+"Title"])}{text("p",h[k+"Sub"],"eyebrow")}{text("p",h[k+"Text"])}<div>{download if k=="pat" else action("psychologistPortalUrl",h["psyAction"],"button outline")}</div>'+ (f'<a class="text-link" href="#contact">{e(h["contactTeam"])} →</a>' if k=='psy' else f'<div id="telecharger" class="stores">{badges}{availability}</div>')+'</article>'
                body+=f'</div></div></section><section id="contact" class="container section split"><div>{text("p",h["contactSlogan"],"eyebrow")}{text("h2",h["contactTitle"])}{text("p",h["contactText"],"lead")}{image("plant.jpg","contact-plant")}</div>{form}</section>'
                body+=f'<section class="soft section"><div class="container closing"><div>{text("h2",t["about"]["title"])}{text("p",t["about"]["text"],"lead")}{text("p",t["about"]["objective"],"lead")}{link("about",h["discover"])}</div>{image("brain.jpg","blend")}</div></section>'
            elif page=='patients':
                p=t['patients']
                body=f'<section class="container hero"><div>{text("h1",p["title"])}{text("p",p["text"],"lead")}<div class="actions">{download}</div><div id="telecharger" class="stores">{badges}{availability}</div></div>{mock("phone")}</section><section class="soft section"><div class="container"><div class="section-heading">{text("h2",p["capTitle"])}</div>{caps(p["caps"],["⌕","▦","▷","♙","▤"])}</div></section><section class="container section"><div class="closing-card">{image("calm.jpg")}<div>{text("h2",p["closeTitle"])}{text("p",p["closeText"],"lead")}<div class="actions">{download}</div></div></div></section>'
            elif page=='psy':
                p=t['psy']
                body=f'<section class="container hero"><div>{text("h1",p["title"])}{text("p",p["text"],"lead")}<div class="actions">{action("psychologistPortalUrl",p["action"])}<a class="text-link" href="#fonctionnalites">{e(p["discover"])} →</a></div></div>{mock("laptop")}</section><section id="fonctionnalites" class="soft section"><div class="container"><div class="section-heading">{text("h2",p["capTitle"])}</div>{caps(p["caps"],["✧","▦","◇","▤"])}</div></section><section class="container section"><div class="closing accent"><div>{text("h2",p["closeTitle"])}{text("p",p["closeText"],"lead")}<div class="actions">{action("psychologistPortalUrl",p["action"])}<a class="text-link" href="{route()}#contact">{e(h["contactTeam"])} →</a></div></div>{image("psychologist.jpg","blend")}</div></section>'
            else:
                body=f'<section class="container hero about"><div>{text("h1",t["about"]["title"])}{text("p",t["about"]["text"],"lead")}{text("p",t["about"]["objective"],"lead")}</div>{image("brain.jpg","blend",False)}</section>'
            nav=''.join(f'<a href="{route(key=k)}"'+(' aria-current="page"' if k==page else '')+f'>{e(t["nav"][k])}</a>' for k in PAGES)+action('resourcesUrl',t['nav']['resources'],'nav-link')
            languages=''.join(f'<a lang="{l}" dir="{"rtl" if l=="ar" else "ltr"}" href="{route(l,page)}"'+(' aria-current="true"' if l==locale else '')+f'>{e(name)}</a>' for l,name in NAMES.items())
            login=f'<details class="login disclosure"><summary class="button outline">{e(t["nav"]["login"])}</summary><div class="panel">{text("h2",t["ui"]["loginTitle"])}{text("p",t["ui"]["loginDesc"])}{action("patientEntryUrl",t["ui"]["patient"],"button outline")}{action("psychologistPortalUrl",t["ui"]["psychologist"],"button outline")}</div></details>'
            header=f'<a class="skip-link" href="#main">{e(t["ui"]["skip"])}</a><header><div class="container header-row"><a href="{route()}" aria-label="Mindcare">{logo()}</a><nav class="desktop-nav" aria-label="{e(t["ui"]["menu"])}">{nav}</nav><div class="header-actions"><details class="language disclosure"><summary aria-label="{e(t["ui"]["language"])}"><span aria-hidden="true">◎</span> <bdi class="latin">{locale.upper()}</bdi></summary><nav class="panel">{languages}</nav></details>{login}<details class="mobile-nav disclosure"><summary aria-label="{e(t["ui"]["menu"])}">☰</summary><nav class="panel">{nav}</nav></details></div></div></header>'
            footer='<footer><div class="container footer-row"><div>'+logo()+text('p',t['footer']['brand'],'muted')+'</div><nav>'+''.join(action(key,t['footer'][label],'nav-link') for key,label in [('privacyUrl','privacy'),('legalNoticeUrl','legal'),('termsUrl','terms')])+f'<a href="{route()}#contact">{e(t["footer"]["contact"])}</a></nav></div></footer>'
            title,description=t['meta'][page]
            origin=C['publicOrigin']
            seo=''
            if origin:
                canonical=origin.rstrip('/')+'/'+locale+'/'+slug
                seo=f'<link rel="canonical" href="{e(canonical)}"><meta property="og:url" content="{e(canonical)}">'+''.join(f'<link rel="alternate" hreflang="{l}" href="{e(origin.rstrip("/")+"/"+l+"/"+slug)}">' for l in T)
            messages=json.dumps({k:t['ui'][k] for k in ['sending','success','failure']},ensure_ascii=False).replace('<','\\u003c')
            output[dest]=f'''<!doctype html>
<html lang="{locale}" dir="{'rtl' if locale=='ar' else 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(title)}</title><meta name="description" content="{e(description)}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary">{seo}<link rel="icon" type="image/svg+xml" href="{url('favicon.svg')}"><link rel="stylesheet" href="{url('styles.css')}"><script src="{url('script.js')}" defer></script></head><body>{header}<main id="main" tabindex="-1" data-page="{page}">{body}</main>{footer}<script type="application/json" id="contact-config">{json.dumps({'endpoint':C['contactEndpoint'],'locale':locale},ensure_ascii=False).replace('<','\\u003c')}</script><script type="application/json" id="contact-messages">{messages}</script></body></html>
'''
    # Root is a complete French homepage with usable links, including without JS.
    root=output['fr/index.html']
    import re
    root=re.sub(r'(href|src)="([^"]+)"',lambda m: f'{m[1]}="{e(os.path.normpath("fr/"+html.unescape(m[2]))) if not urlparse(html.unescape(m[2])).scheme and not m[2].startswith("#") else m[2]}"',root)
    # Relative directory targets must retain their final slash.
    root=re.sub(r'href="(fr|en|ar)(/[^".#]+)?"',lambda m:'href="'+m[1]+(m[2] or '')+'/"',root)
    output['index.html']=root
    home_url=e(C['publicOrigin'] or '/')
    output['404.html']=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — Mindcare</title></head><body><h1>404</h1><p>Page not found. / Page introuvable. / <span lang="ar" dir="rtl">الصفحة غير موجودة.</span></p><p><a id="home" href="{home_url}">Mindcare</a></p><script>if (document.getElementById('home').getAttribute('href') === '/' && location.hostname.endsWith('.github.io')) document.getElementById('home').href = '/' + location.pathname.split('/').filter(Boolean)[0] + '/';</script></body></html>\n'''
    output['.nojekyll']=''
    if C['publicOrigin']:
        origin=C['publicOrigin'].rstrip('/')
        hostname=urlparse(origin).hostname
        if hostname and not hostname.endswith('.github.io'):
            output['CNAME']=hostname+'\n'
        output['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{e(origin+"/"+str(Path(p).parent)+"/")}</loc></url>' for p in output if p.endswith('index.html') and p!='index.html')+'</urlset>\n'
        output['robots.txt']='User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n'
    else:
        output['robots.txt']='User-agent: *\nAllow: /\n'
    return output

if __name__=='__main__':
    if not C['publicOrigin']:
        (ROOT / 'sitemap.xml').unlink(missing_ok=True)
    for name,value in render_all().items():
        path=ROOT/name
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(value,encoding='utf-8')
    print('Generated 12 localized pages, French root, 404 and hosting files.')
