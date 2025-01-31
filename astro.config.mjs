// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import lenis from 'astro-lenis';

export default defineConfig({
  integrations: [tailwind(), react(), lenis()]
});