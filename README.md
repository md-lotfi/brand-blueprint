# Welcome to your Lovable project

## Developer handoff: publication dependencies

The showcase design can be completed independently of integrations. Before publishing with functional calls to action:
- Confirm real App Store and Google Play listings, configure their URLs, add official localized badge assets, then enable their verification flags.
- Supply patient and psychologist portal destinations.
- Supply approved resources, privacy, legal notice, and terms destinations/content.
- Configure and test contact-form delivery; never treat an unconfigured submission as successful.
- Replace generic device/logo illustrations only when actual product screenshots are provided.

All integration settings are centralized in `src/config/site.ts`. Pending actions remain safely disabled without launch promises or additional visible explanatory copy. Nexa Book/Bold use the supplied fonts; Arabic retains Noto Sans Arabic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
