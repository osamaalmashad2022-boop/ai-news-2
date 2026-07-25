import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://ai-news-2-osamaalmashad2022-boop.vercel.app',
  integrations: [
    tailwind(),
    sitemap(),
    pagefind(),
  ],
  build: {
    format: 'directory',
  },
});
