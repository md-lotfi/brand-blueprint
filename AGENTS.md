<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Showcase implementation
- Keep external destinations, store listing verification, localized official badges, and contact delivery in `src/config/site.ts` so deferred integrations can be enabled without page redesign.
- Render store badges and availability only after verified listings and official localized badge assets are configured; unconfigured actions are inert with accessibility states.
- Load uploaded media through Lovable Assets pointers; the favicon is the original SVG served directly from public.
- Keep device illustrations limited to generic frames and the original brand mark until real product screenshots are supplied.
- Use language-scoped font families, Radix direction props, and logical text alignment for Arabic; isolate Latin brand labels and email/phone fields so mixed-direction content stays legible.
