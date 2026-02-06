import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
export default defineConfig({
  site: 'https://fonts.mnr.bd',
  integrations: [sitemap(), tailwind(), preact()],
});
