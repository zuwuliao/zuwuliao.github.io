// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://zuwuliao.github.io',
	base: '/my-astro-blog',
	integrations: [mdx(), sitemap()],
});
