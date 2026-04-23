// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://starzonmyarmz.github.io',
  base: '/til',
  integrations: [mdx(), react()],
  devToolbar: { enabled: false },
});
