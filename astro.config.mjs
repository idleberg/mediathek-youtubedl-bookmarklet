// @ts-check
import { defineConfig } from 'astro/config';
import bookmarklet from 'vite-plugin-bookmarklet'
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://idleberg.github.io/mediathek-youtubedl-bookmarklet/',
		vite: {
				plugins: [bookmarklet(), tailwindcss()]
		}
});
