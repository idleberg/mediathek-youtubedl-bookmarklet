import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import bookmarklet from 'vite-plugin-bookmarklet';

export default defineConfig({
	site: 'https://idleberg.github.io/mediathek-youtubedl-bookmarklet/',
	vite: {
		plugins: [bookmarklet(), tailwindcss()],
	},
});
