#!/usr/bin/env python3
"""Check generated parity, local URLs/fragments, assets and integration gating."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from render_pages import ROOT, C, T, render_all

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag,dict(attrs)))

errors=[]
def check(ok,label):
    if not ok: errors.append(label)
outputs=render_all()
documents={p:Document(s) for p,s in outputs.items() if p.endswith('.html')}
for name, expected in outputs.items():
    path=ROOT/name
    check(path.exists() and path.read_text()==expected, 'Stale output: '+name)
for name,doc in documents.items():
    check(sum(tag=='h1' for tag,a in doc.tags)==1,name+': expected one h1')
    if name=='404.html': continue
    locale=name.split('/')[0] if '/' in name else 'fr'
    check(any(tag=='html' and a.get('lang')==locale and a.get('dir')==('rtl' if locale=='ar' else 'ltr') for tag,a in doc.tags),name+': language/direction')
    check(sum(tag=='main' for tag,a in doc.tags)==1,name+': expected one main')
    check('/__l5e/' not in outputs[name] and 'react' not in outputs[name].lower(),name+': framework/CDN pointer')
    check(any(tag=='meta' and a.get('name')=='description' and a.get('content') for tag,a in doc.tags),name+': missing metadata')
    for tag,a in doc.tags:
        for attr in ('href','src'):
            value=a.get(attr)
            if value is None: continue
            parts=urlsplit(value)
            if parts.scheme or parts.netloc: continue
            check(not value.startswith('/'),name+': root-relative URL '+value)
            target=(ROOT/Path(name).parent/unquote(parts.path)).resolve() if parts.path else ROOT/name
            if target.is_dir(): target=target/'index.html'
            check(target.is_relative_to(ROOT) and target.exists(),name+': missing '+value)
            if parts.fragment and target.exists() and target.suffix=='.html':
                ids={attrs['id'] for _,attrs in Document(target.read_text()).tags if 'id' in attrs}
                check(unquote(parts.fragment) in ids,name+': missing fragment '+value)
    for tag,a in doc.tags:
        if tag=='span' and a.get('role')=='link': check(a.get('aria-disabled')=='true',name+': inert link accessibility')
for filename,digest in json.loads((ROOT/'tools/asset_checksums.json').read_text()).items():
    asset=ROOT/filename
    check(asset.exists() and hashlib.sha256(asset.read_bytes()).hexdigest()==digest,'Asset mismatch: '+filename)
# Check future enablement and the requirement for official localized badges.
original=C.copy()
try:
    C.update(appStoreUrl='https://example.org/app',appStoreVerified=True, appStoreBadges={'fr':None,'en':None,'ar':None})
    check('class="store-badge"' not in render_all()['fr/patients/index.html'],'Unconfigured badge must remain hidden')
    C['appStoreBadges']={'fr':'assets/mindcare-logo.svg','en':None,'ar':None}
    sample=render_all()
    check('class="store-badge"' in sample['fr/patients/index.html'],'Verified localized badge enablement')
    check('class="store-badge"' not in sample['ar/patients/index.html'],'Badge locale isolation')
    check(T['fr']['home']['availability'] not in sample['fr/patients/index.html'],'Availability requires both stores')
    C['publicOrigin']='https://example.org/showcase/'
    configured=render_all()
    check('https://example.org/showcase/fr/patients/' in configured['sitemap.xml'],'Sitemap supports repository subpath')
    check('rel="canonical" href="https://example.org/showcase/ar/a-propos/"' in configured['ar/a-propos/index.html'],'Canonical supports locale and subpath')
finally:
    C.clear(); C.update(original)
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(documents)} HTML documents; output parity, locale/RTL, local links/fragments, asset checksums, integration gates.')
