// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://til.iamdanielmarino.com',
  integrations: [mdx(), react()],
  devToolbar: { enabled: false },
});
