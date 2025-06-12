import { defineConfig } from 'astro/config';
import react from '@astro/react';
import tailwind from '@astro/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  output: 'static'
});