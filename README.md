# Mindcare showcase

Plain HTML, CSS and JavaScript for GitHub Pages. No npm install, React, Vite, server runtime, or build service is required to publish. French is available at `/` and `/fr/`; English at `/en/`; Arabic at `/ar/`. Each locale has home, patients, psychologists and about pages. Links and assets use relative URLs to support a repository subpath.

## Preview and validation

```sh
python3 -m http.server 8080
# Visit http://localhost:8080/
python3 tools/render_pages.py
python3 tools/check_static.py
```

Python 3.9+ is used only to regenerate and check the committed files. GitHub Pages serves the generated files directly. Edit `content/translations.json`, `tools/render_pages.py`, `styles.css` and `script.js`, then regenerate and check. Do not hand-edit generated HTML.

Optional browser checks require Node 22+ and Chrome, without npm packages:

```sh
MINDCARE_PREVIEW_ORIGIN=http://localhost:8080/ node tools/check_browser.mjs
```

The browser checker covers all pages at 320, 390, 768 and 1440 pixels, native menus, language switching, keyboard focus, reduced motion and rendering without JavaScript. It writes screenshots and a report to `/tmp`.

## Publish on GitHub Pages

1. Commit and push the static files normally. Keep published Lovable history intact.
2. Open **Settings → Pages → Deploy from a branch**.
3. Select the connected branch and **/(root)**, then save.

The entry point is `index.html`; `.nojekyll` disables Jekyll processing. See [GitHub’s publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

The public URL is `https://aboutcare.raystate.com`, configured through `publicOrigin` in `src/config/site.ts`. Regeneration writes canonical/hreflang metadata, `sitemap.xml`, the sitemap reference in `robots.txt`, and `CNAME` for a custom hostname. Configure **Settings → Pages → Custom domain** to `aboutcare.raystate.com` and enable **Enforce HTTPS** once available. DNS and GitHub Pages settings are managed separately from these repository files. If moving to a `github.io` project URL, include its repository path in `publicOrigin` and remove the former `CNAME`.

## Integration configuration

Keep all destinations in `src/config/site.ts`. Its `siteConfig` object deliberately uses valid JSON syntax so the Python generator can read it without a TypeScript toolchain.

- Store actions require a real listing URL, verification flag, and official badge asset for the current language. Availability text requires both stores. Put official local badges in `assets/` and use paths such as `assets/app-store-fr.svg`.
- Psychologist access links use `https://mindcare.raystate.com/`. Patient entry points, resources, and legal URLs remain unavailable until supplied. No legal copy is invented.
- `contactEndpoint` must accept cross-origin JSON POST `{name, email, phone, message, locale}` and return a successful HTTP status only after accepting delivery. The submit button stays disabled without a configured endpoint and JavaScript. Verify actual inbox delivery separately.
- Mobile frames display the supplied `assets/mindcare-home.png` welcome-screen capture, in its original French language. The laptop illustration remains a generic frame with the original logo.

The original Nexa files were copied from the main Mindcare application and match the uploaded asset-pointer sizes. Original JPG illustrations and SVG favicon are local. Noto Sans Arabic and its license come from the Staffly reference. `tools/asset_checksums.json` records the local assets; update it deliberately if artwork changes.

`AGENTS.md` is preserved. The Laravel repository `/var/www/html/mindcare` is unchanged. Conversion has not published or pushed this repository.
