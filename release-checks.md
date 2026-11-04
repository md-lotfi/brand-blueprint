# Static conversion checks

Validated locally on 2026-11-04 in `/var/www/html/mindcare_showcase`.

- `python3 tools/render_pages.py`: generates 12 localized pages, the French root, 404 and hosting files.
- `python3 tools/check_static.py`: passes output parity, HTML structure, local URLs/fragments, locale/RTL, asset checksums, store gating and configurable canonical/sitemap paths.
- `node --check script.js`: passes.
- Chrome: 52 page/viewport combinations at 320, 390, 768 and 1440 pixels, served under `/mindcare_showcase/` to verify project-path hosting. No horizontal overflow, broken images or browser exceptions were found. Navigation, language switching, focus, Escape, reduced motion and content without JavaScript passed.
- Desktop French and mobile Arabic screenshots were visually reviewed. Browser artifacts: `/tmp/mindcare-desktop.png`, `/tmp/mindcare-ar-mobile.png`, `/tmp/mindcare-browser-results.json`.
- Original JPG dimensions and font file signatures checked; Nexa sizes match the original Lovable pointer metadata. Local assets and favicon are recorded in `tools/asset_checksums.json`.
- `AGENTS.md` remains unchanged. The main Laravel repository was read only for the supplied font files; no application files were modified.

The confirmed public URL is `https://aboutcare.raystate.com`. Generated canonical links, hreflang URLs, sitemap, robots sitemap reference, 404 home link and `CNAME` now use it. Static validation passed again after domain configuration.

Public DNS on 2026-11-04 resolved to Cloudflare addresses; HTTPS returned HTTP 404 with GitHub response headers through Cloudflare. The domain reaches GitHub infrastructure, but the showcase is not yet confirmed published there. The underlying CNAME target is hidden by the proxy and was not independently verified. Push/deployment, GitHub Pages custom-domain association, origin HTTPS, live locale routes, store listings, portal/legal/resource destinations and contact inbox delivery remain unverified or unconfigured.

## Supplied mobile screenshot

Replaced the generic mobile logo screen with `/home/ferhat/Pictures/mindcare_screenshots/home.png`, copied unchanged to `assets/mindcare-home.png` (1080×2170; updated source image). All seven home/patient page placements use the capture with localized alt text identifying its French UI. The full image fits inside the phone frame without stretching or a fabricated notch. Asset checksums and static validation pass; all 52 browser layout checks pass again. French desktop and Arabic mobile previews were visually reviewed. The laptop illustration remains generic.
